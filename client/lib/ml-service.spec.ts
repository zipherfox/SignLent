import { describe, it, expect, beforeEach } from "vitest";
import { MLService } from "./ml-service";
import type { SensorDataArray, MLConfig } from "@shared/MLTypes";

function makeConfig(overrides?: Partial<MLConfig>): MLConfig {
  return {
    max_timesteps: 30,
    num_features: 15,
    confidence_threshold: 0.6,
    margin_threshold: 0.1,
    motion_threshold: 0.25,
    rotation_threshold: 35,
    stable_frames: 8,
    min_gesture_frames: 15,
    max_gesture_frames: 60,
    normalization: {
      flex_min: [100, 200, 150, 180, 120],
      flex_max: [3000, 3200, 2800, 3100, 2900],
      feature_means: [0.1, -0.2, 9.8, 5.0, -3.0, 1.5],
      feature_stds: [0.5, 0.6, 1.0, 10.0, 8.0, 12.0],
    },
    ...overrides,
  };
}

/** Create a SensorDataArray with specified values or zeros */
function makeSensorData(overrides?: Partial<Record<number, number>>): SensorDataArray {
  const data: number[] = new Array(15).fill(0);
  if (overrides) {
    for (const [k, v] of Object.entries(overrides)) {
      data[Number(k)] = v;
    }
  }
  return data as unknown as SensorDataArray;
}

describe("MLService", () => {
  let service: MLService;
  const labels = ["hello", "thank_you", "yes"];
  const config = makeConfig();

  beforeEach(() => {
    service = new MLService();
    service.initializeWithData(labels, config);
  });

  describe("initializeWithData", () => {
    it("should set isReady to true", () => {
      expect(service.isReady).toBe(true);
    });

    it("should store labels", () => {
      expect(service.getLabels()).toEqual(["hello", "thank_you", "yes"]);
    });

    it("should store config", () => {
      const storedConfig = service.getConfig();
      expect(storedConfig).not.toBeNull();
      expect(storedConfig!.max_timesteps).toBe(30);
    });

    it("should return a copy of labels", () => {
      const a = service.getLabels();
      const b = service.getLabels();
      expect(a).toEqual(b);
      a.push("extra");
      expect(service.getLabels()).not.toContain("extra");
    });
  });

  describe("normalizeSensorData", () => {
    it("should normalize flex sensors with min-max scaling", () => {
      // flex_min[0]=100, flex_max[0]=3000 => range=2900
      // value=1550 => (1550-100)/2900 = 0.5
      const frame = makeSensorData({ 0: 1550 });
      const result = service.normalizeSensorData([frame]);
      expect(result[0][0]).toBeCloseTo(0.5, 2);
    });

    it("should clip flex values to [0, 1]", () => {
      // value=0 with min=100 => (0-100)/2900 = -0.034 => clipped to 0
      const frame = makeSensorData({ 0: 0 });
      const result = service.normalizeSensorData([frame]);
      expect(result[0][0]).toBe(0);
    });

    it("should set saturated readings (>=4095) to 1.0", () => {
      const frame = makeSensorData({ 0: 4095 });
      const result = service.normalizeSensorData([frame]);
      expect(result[0][0]).toBe(1.0);
    });

    it("should z-score standardize IMU data (indices 9-14)", () => {
      // mean[0]=0.1, std[0]=0.5, value=0.6 => (0.6-0.1)/0.5 = 1.0
      const frame = makeSensorData({ 9: 0.6 });
      const result = service.normalizeSensorData([frame]);
      expect(result[0][9]).toBeCloseTo(1.0, 5);
    });

    it("should not modify quaternion values (indices 5-8)", () => {
      const frame = makeSensorData({ 5: 0.707, 6: 0.0, 7: 0.707, 8: 0.0 });
      const result = service.normalizeSensorData([frame]);
      expect(result[0][5]).toBeCloseTo(0.707, 3);
      expect(result[0][6]).toBe(0);
      expect(result[0][7]).toBeCloseTo(0.707, 3);
      expect(result[0][8]).toBe(0);
    });

    it("should handle multiple frames", () => {
      const frames: SensorDataArray[] = [
        makeSensorData({ 0: 1550 }),
        makeSensorData({ 0: 3000 }),
      ];
      const result = service.normalizeSensorData(frames);
      expect(result).toHaveLength(2);
      expect(result[0][0]).toBeCloseTo(0.5, 2);
      expect(result[1][0]).toBeCloseTo(1.0, 2);
    });

    it("should throw if config not loaded", () => {
      const uninitService = new MLService();
      expect(() =>
        uninitService.normalizeSensorData([makeSensorData()]),
      ).toThrow("Config not loaded");
    });
  });

  describe("prepareGestureData", () => {
    it("should pad short sequences by repeating last frame", () => {
      const data = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      ];
      const result = service.prepareGestureData(data);
      expect(result).toHaveLength(30); // max_timesteps
      // Last 28 frames should all equal the second frame
      for (let i = 2; i < 30; i++) {
        expect(result[i]).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
      }
    });

    it("should truncate long sequences", () => {
      const data = Array.from({ length: 50 }, (_, i) =>
        new Array(15).fill(i),
      );
      const result = service.prepareGestureData(data);
      expect(result).toHaveLength(30);
      expect(result[0]).toEqual(new Array(15).fill(0));
      expect(result[29]).toEqual(new Array(15).fill(29));
    });

    it("should return exact length data unchanged", () => {
      const data = Array.from({ length: 30 }, (_, i) =>
        new Array(15).fill(i),
      );
      const result = service.prepareGestureData(data);
      expect(result).toHaveLength(30);
    });

    it("should throw if config not loaded", () => {
      const uninitService = new MLService();
      expect(() => uninitService.prepareGestureData([[1]])).toThrow(
        "Config not loaded",
      );
    });
  });

  describe("processFrame - gesture segmentation", () => {
    it("should stay idle with no motion", () => {
      const frame = makeSensorData(); // all zeros = no motion
      const result = service.processFrame(frame);
      expect(result.status).toBe("idle");
    });

    it("should transition to start on significant motion", () => {
      // accel magnitude > 0.25 threshold
      const frame = makeSensorData({ 9: 1.0, 10: 0, 11: 0 });
      const result = service.processFrame(frame);
      expect(result.status).toBe("start");
    });

    it("should transition from start to active after enough active frames", () => {
      const movingFrame = makeSensorData({ 9: 1.0, 10: 0, 11: 0 });

      service.processFrame(movingFrame); // start
      service.processFrame(movingFrame); // active count = 2
      service.processFrame(movingFrame); // active count = 3
      const result = service.processFrame(movingFrame); // active count = 4 >= minActiveFrames
      expect(result.status).toBe("active");
    });

    it("should reset to idle if stable frames during start phase", () => {
      const movingFrame = makeSensorData({ 9: 1.0, 10: 0, 11: 0 });
      const stillFrame = makeSensorData();

      service.processFrame(movingFrame); // start
      service.processFrame(stillFrame); // stableCount = 1
      service.processFrame(stillFrame); // stableCount = 2
      const result = service.processFrame(stillFrame); // stableCount = 3 => idle
      expect(result.status).toBe("idle");
    });

    it("should end gesture after enough stable frames in active state", () => {
      const movingFrame = makeSensorData({ 9: 1.0, 10: 0, 11: 0 });
      const stillFrame = makeSensorData();

      // Get to active state (4 frames with minActiveFrames=4)
      for (let i = 0; i < 4; i++) service.processFrame(movingFrame);
      // Add more moving frames to meet minGestureFrames (15)
      for (let i = 0; i < 12; i++) service.processFrame(movingFrame);

      // Now stop moving - stableFrames(8) still frames transitions active->end
      for (let i = 0; i < config.stable_frames; i++) {
        service.processFrame(stillFrame);
      }
      // State is now "end", stableCount is already >= stableFrames.
      // The next still frame increments stableCount further (still >= stableFrames)
      // and buffer.length >= minGestureFrames, so it returns end with data.
      const result = service.processFrame(stillFrame);
      expect(result.status).toBe("end");
      expect(result.data).toBeDefined();
      expect(result.data!.length).toBeGreaterThanOrEqual(config.min_gesture_frames);
    });

    it("should end gesture when max frames reached", () => {
      const movingFrame = makeSensorData({ 9: 1.0, 10: 0, 11: 0 });

      // Get to active state
      for (let i = 0; i < 4; i++) service.processFrame(movingFrame);

      // Keep adding until maxGestureFrames
      for (let i = 4; i < config.max_gesture_frames - 1; i++) {
        service.processFrame(movingFrame);
      }

      const result = service.processFrame(movingFrame);
      expect(result.status).toBe("end");
      expect(result.data).toBeDefined();
    });
  });

  describe("predict", () => {
    it("should throw if not initialized", async () => {
      const uninitService = new MLService();
      await expect(
        uninitService.predict([makeSensorData()]),
      ).rejects.toThrow("ML Service not initialized");
    });

    it("should return prediction with mock model", async () => {
      // Mock model that returns [0.8, 0.1, 0.1] => "hello" with high confidence
      const mockModel = {
        predict: (_input: Float32Array) =>
          new Float32Array([0.8, 0.1, 0.1]),
      };
      service.setModel(mockModel);

      const gestureData: SensorDataArray[] = Array.from({ length: 30 }, () =>
        makeSensorData({ 0: 1550, 9: 0.6 }),
      );

      const result = await service.predict(gestureData);
      expect(result.word).toBe("hello");
      expect(result.confidence).toBeCloseTo(0.8, 5);
      expect(result.isConfident).toBe(true);
      expect(result.margin).toBeCloseTo(0.7, 5);
      expect(result.allProbabilities).toHaveLength(3);
    });

    it("should return UNCERTAIN for low-confidence predictions", async () => {
      const mockModel = {
        predict: (_input: Float32Array) =>
          new Float32Array([0.4, 0.35, 0.25]),
      };
      service.setModel(mockModel);

      const gestureData: SensorDataArray[] = Array.from({ length: 30 }, () =>
        makeSensorData(),
      );

      const result = await service.predict(gestureData);
      expect(result.word).toBe("UNCERTAIN");
      expect(result.isConfident).toBe(false);
    });
  });

  describe("parseSensorLine", () => {
    it("should parse valid 15-value CSV line", () => {
      const line = "1,2,3,4,5,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0";
      const result = service.parseSensorLine(line);
      expect(result).not.toBeNull();
      expect(result![0]).toBe(1);
      expect(result![14]).toBe(1.0);
    });

    it("should return null for wrong number of values", () => {
      const result = service.parseSensorLine("1,2,3");
      expect(result).toBeNull();
    });

    it("should return null for NaN values", () => {
      const result = service.parseSensorLine(
        "1,2,3,4,5,6,7,8,9,10,abc,12,13,14,15",
      );
      expect(result).toBeNull();
    });

    it("should handle whitespace trimming", () => {
      const line = "  1,2,3,4,5,6,7,8,9,10,11,12,13,14,15  ";
      const result = service.parseSensorLine(line);
      expect(result).not.toBeNull();
    });
  });

  describe("reset", () => {
    it("should reset segmenter state", () => {
      const movingFrame = makeSensorData({ 9: 1.0, 10: 0, 11: 0 });
      service.processFrame(movingFrame); // start
      service.reset();
      const result = service.processFrame(makeSensorData());
      expect(result.status).toBe("idle");
    });
  });

  describe("destroy", () => {
    it("should clear model and mark as not ready", () => {
      service.destroy();
      expect(service.isReady).toBe(false);
    });
  });
});
