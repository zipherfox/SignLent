import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { MLService } from "./ml-service";
import type { SensorDataArray, MLConfig } from "@shared/MLTypes";

/**
 * Integration tests using the actual model config and labels from public/models/.
 * The TFLite WASM runtime cannot run in Node, so we use a mock model
 * that returns the correct output shape (7 labels) to verify the full pipeline.
 */

const modelsDir = resolve(__dirname, "../../public/models");

function loadJsonFile<T>(filename: string): T {
  const content = readFileSync(resolve(modelsDir, filename), "utf-8");
  return JSON.parse(content) as T;
}

/** Generate a realistic sensor frame with plausible values */
function makeRealisticFrame(overrides?: Partial<Record<number, number>>): SensorDataArray {
  // Typical values: flex sensors ~3000-3500, quaternion ~0-1, accel ~-1 to 1, gyro ~-10 to 10
  const data: number[] = [
    3200, 2900, 3000, 2950, 2700, // flex sensors
    0.5, 0.1, 0.7, 0.2,          // quaternion
    -0.5, -0.7, 0.25,            // accel (close to config feature_means)
    -4.0, -3.0, -0.6,            // gyro (close to config feature_means)
  ];
  if (overrides) {
    for (const [k, v] of Object.entries(overrides)) {
      data[Number(k)] = v;
    }
  }
  return data as unknown as SensorDataArray;
}

describe("MLService integration with real model files", () => {
  let config: MLConfig;
  let labels: string[];

  beforeAll(() => {
    config = loadJsonFile<MLConfig>("config.json");
    const labelsData = loadJsonFile<{ labels: string[] }>("labels.json");
    labels = labelsData.labels;
  });

  describe("model file validation", () => {
    it("should have valid config with expected fields", () => {
      expect(config.max_timesteps).toBe(30);
      expect(config.num_features).toBe(15);
      expect(config.normalization.flex_min).toHaveLength(5);
      expect(config.normalization.flex_max).toHaveLength(5);
      expect(config.normalization.feature_means).toHaveLength(6);
      expect(config.normalization.feature_stds).toHaveLength(6);
      expect(config.confidence_threshold).toBeGreaterThan(0);
      expect(config.margin_threshold).toBeGreaterThan(0);
    });

    it("should have valid labels", () => {
      expect(labels).toHaveLength(7);
      expect(labels).toContain("hello");
      expect(labels).toContain("goodbye");
      expect(labels).toContain("yes");
      expect(labels).toContain("no");
      expect(labels).toContain("please");
      expect(labels).toContain("sorry");
      expect(labels).toContain("thankyou");
    });

    it("should have a valid TFLite model file", () => {
      const modelData = readFileSync(resolve(modelsDir, "model.tflite"));
      expect(modelData.length).toBeGreaterThan(0);
      // TFLite FlatBuffer: identifier "TFL3" at bytes 4-7
      expect(modelData[4]).toBe(0x54); // T
      expect(modelData[5]).toBe(0x46); // F
      expect(modelData[6]).toBe(0x4c); // L
      expect(modelData[7]).toBe(0x33); // 3
    });

    it("config flex ranges should be valid (max > min)", () => {
      for (let i = 0; i < 5; i++) {
        expect(config.normalization.flex_max[i]).toBeGreaterThan(
          config.normalization.flex_min[i],
        );
      }
    });

    it("config feature stds should be positive", () => {
      for (const std of config.normalization.feature_stds) {
        expect(std).toBeGreaterThan(0);
      }
    });
  });

  describe("end-to-end prediction pipeline with real config", () => {
    let service: MLService;

    beforeAll(() => {
      service = new MLService();
      service.initializeWithData(labels, config);
    });

    it("should normalize realistic sensor data correctly", () => {
      const frame = makeRealisticFrame();
      const normalized = service.normalizeSensorData([frame]);

      // Flex values should be in [0, 1] range after normalization
      for (let i = 0; i < 5; i++) {
        expect(normalized[0][i]).toBeGreaterThanOrEqual(0);
        expect(normalized[0][i]).toBeLessThanOrEqual(1);
      }

      // Quaternion values (5-8) should be unchanged
      expect(normalized[0][5]).toBeCloseTo(0.5, 3);
      expect(normalized[0][6]).toBeCloseTo(0.1, 3);

      // IMU values (9-14) should be z-score normalized
      // When input is close to mean, normalized value should be close to 0
      expect(Math.abs(normalized[0][9])).toBeLessThan(5);
      expect(Math.abs(normalized[0][14])).toBeLessThan(5);
    });

    it("should prepare gesture data to match model input shape", () => {
      const frames = Array.from({ length: 20 }, () =>
        Array.from({ length: 15 }, () => Math.random()),
      );
      const prepared = service.prepareGestureData(frames);
      expect(prepared).toHaveLength(config.max_timesteps); // 30
      expect(prepared[0]).toHaveLength(config.num_features); // 15
    });

    it("should run full prediction pipeline with mock model matching real labels", () => {
      // Mock model that returns probabilities for 7 labels (matching labels.json)
      // Simulate a confident "hello" prediction
      const mockModel = {
        predict: (_input: Float32Array): Float32Array => {
          // 7 outputs: [goodbye, hello, no, please, sorry, thankyou, yes]
          return new Float32Array([0.02, 0.85, 0.03, 0.02, 0.03, 0.02, 0.03]);
        },
      };
      service.setModel(mockModel);

      const gestureData: SensorDataArray[] = Array.from(
        { length: config.max_timesteps },
        () => makeRealisticFrame(),
      );

      return service.predict(gestureData).then((result) => {
        expect(result.word).toBe("hello");
        expect(result.confidence).toBeCloseTo(0.85, 2);
        expect(result.isConfident).toBe(true);
        expect(result.allProbabilities).toHaveLength(7);
        expect(result.allProbabilities.map((p) => p.word)).toEqual(labels);
      });
    });

    it("should return UNCERTAIN when model is not confident", async () => {
      const mockModel = {
        predict: (_input: Float32Array): Float32Array => {
          // Uniform-ish probabilities - no clear winner
          return new Float32Array([0.15, 0.16, 0.14, 0.15, 0.13, 0.14, 0.13]);
        },
      };
      service.setModel(mockModel);

      const gestureData: SensorDataArray[] = Array.from(
        { length: config.max_timesteps },
        () => makeRealisticFrame(),
      );

      const result = await service.predict(gestureData);
      expect(result.word).toBe("UNCERTAIN");
      expect(result.isConfident).toBe(false);
    });

    it("should handle all 7 label predictions correctly", async () => {
      for (let labelIdx = 0; labelIdx < labels.length; labelIdx++) {
        const probs = new Float32Array(7).fill(0.02);
        probs[labelIdx] = 0.88;
        const mockModel = {
          predict: (_input: Float32Array): Float32Array => probs,
        };
        service.setModel(mockModel);

        const gestureData: SensorDataArray[] = Array.from(
          { length: config.max_timesteps },
          () => makeRealisticFrame(),
        );

        const result = await service.predict(gestureData);
        expect(result.word).toBe(labels[labelIdx]);
        expect(result.isConfident).toBe(true);
      }
    });

    it("should correctly flatten input data for model", async () => {
      let capturedInput: Float32Array | null = null;
      const mockModel = {
        predict: (input: Float32Array): Float32Array => {
          capturedInput = new Float32Array(input);
          return new Float32Array(7).fill(1 / 7);
        },
      };
      service.setModel(mockModel);

      const gestureData: SensorDataArray[] = Array.from(
        { length: config.max_timesteps },
        () => makeRealisticFrame(),
      );

      await service.predict(gestureData);
      expect(capturedInput).not.toBeNull();
      expect(capturedInput!.length).toBe(
        config.max_timesteps * config.num_features, // 30 * 15 = 450
      );
    });
  });
});
