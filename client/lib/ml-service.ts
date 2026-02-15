import type {
  SensorDataArray,
  GestureSegmenterConfig,
  MLConfig,
  ProcessFrameResult,
  PredictionResult,
  ProbabilityItem,
} from "@shared/MLTypes";

export class MLService {
  private model: { predict(input: Float32Array): Float32Array } | null = null;
  private labels: string[] = [];
  private config: MLConfig | null = null;
  public isReady: boolean = false;
  private segmenter: GestureSegmenterConfig;

  constructor() {
    this.segmenter = {
      buffer: [],
      stableCount: 0,
      motionThreshold: 0.25,
      rotationThreshold: 35,
      stableFrames: 8,
      minGestureFrames: 15,
      maxGestureFrames: 60,
      state: "idle",
      activeCount: 0,
      minActiveFrames: 4,
    };
  }

  async initialize(
    labelsUrl: string,
    configUrl: string,
    modelUrl: string,
  ): Promise<boolean> {
    try {
      console.log("Initializing ML Service...");

      console.log("Loading labels...");
      const labelsResponse = await fetch(labelsUrl);
      const labelsData: { labels: string[] } = await labelsResponse.json();
      this.labels = labelsData.labels;
      console.log("Labels loaded:", this.labels);

      console.log("Loading config...");
      const configResponse = await fetch(configUrl);
      this.config = (await configResponse.json()) as MLConfig;
      console.log("Config loaded");

      if (this.config) {
        this.segmenter.motionThreshold = this.config.motion_threshold;
        this.segmenter.rotationThreshold = this.config.rotation_threshold;
        this.segmenter.stableFrames = this.config.stable_frames;
        this.segmenter.minGestureFrames = this.config.min_gesture_frames;
        this.segmenter.maxGestureFrames = this.config.max_gesture_frames;
      }

      console.log("Loading TFLite model...");
      const tf = await import("@tensorflow/tfjs-core");
      await import("@tensorflow/tfjs-backend-cpu");
      await tf.ready();
      const tflite = await import("@tensorflow/tfjs-tflite");
      tflite.setWasmPath("/tflite-wasm/");
      const tfliteModel = await tflite.loadTFLiteModel(modelUrl);
      console.log("TFLite model loaded");

      // Wrap the TFLite model to match the predict interface
      const numFeatures = this.config!.num_features;
      const maxTimesteps = this.config!.max_timesteps;
      const Tensor = tf.Tensor;
      this.model = {
        predict(input: Float32Array): Float32Array {
          const inputTensor = tf.tensor(input, [1, maxTimesteps, numFeatures]);
          const output = tfliteModel.predict(inputTensor);
          let outputTensor: InstanceType<typeof Tensor>;
          if (output instanceof Tensor) {
            outputTensor = output;
          } else if (Array.isArray(output)) {
            outputTensor = output[0];
          } else {
            outputTensor = Object.values(output)[0] as InstanceType<typeof Tensor>;
          }
          const result = outputTensor.dataSync() as Float32Array;
          inputTensor.dispose();
          outputTensor.dispose();
          return result;
        },
      };

      this.isReady = true;
      console.log("✅ ML Service ready!");
      return true;
    } catch (error) {
      console.error("Error initializing ML Service:", error);
      throw error;
    }
  }

  /**
   * Initialize with pre-loaded data (for testing or when data is already available).
   */
  initializeWithData(labels: string[], config: MLConfig): void {
    this.labels = labels;
    this.config = config;

    this.segmenter.motionThreshold = config.motion_threshold;
    this.segmenter.rotationThreshold = config.rotation_threshold;
    this.segmenter.stableFrames = config.stable_frames;
    this.segmenter.minGestureFrames = config.min_gesture_frames;
    this.segmenter.maxGestureFrames = config.max_gesture_frames;

    this.isReady = true;
  }

  /**
   * Set the model instance for inference.
   */
  setModel(model: { predict(input: Float32Array): Float32Array }): void {
    this.model = model;
  }

  /**
   * Normalizes sensor data matching the Python inference code.
   * 1. Min-Max scaling for flex sensors (0-4) with clipping to [0, 1]
   * 2. Skipping quaternions (5-8) - they're already normalized
   * 3. Z-score standardization for IMU data (9-14)
   */
  normalizeSensorData(sensorData: SensorDataArray[]): number[][] {
    if (!this.config) {
      throw new Error("Config not loaded");
    }

    const params = this.config.normalization;
    let totalSaturatedReadings = 0;

    const normalized = sensorData.map((frame) => {
      const normalizedFrame = [...frame];

      for (let i = 0; i < 5; i++) {
        const min = params.flex_min[i];
        const max = params.flex_max[i];

        if (max > min) {
          const isSaturated = frame[i] >= 4095;
          if (isSaturated) {
            totalSaturatedReadings++;
          }

          normalizedFrame[i] = (frame[i] - min) / (max - min);
          normalizedFrame[i] = Math.max(0, Math.min(1, normalizedFrame[i]));

          if (isSaturated) {
            normalizedFrame[i] = 1.0;
          }
        }
      }

      const imuMeans = params.feature_means;
      const imuStds = params.feature_stds;

      if (!imuMeans || !imuStds) {
        console.warn("IMU normalization parameters not found in config");
      } else {
        for (let i = 9; i < 15; i++) {
          const imuIndex = i - 9;
          const mean = imuMeans[imuIndex];
          const std = imuStds[imuIndex];

          if (std > 1e-6) {
            normalizedFrame[i] = (frame[i] - mean) / std;
          }
        }
      }

      return normalizedFrame;
    });

    if (totalSaturatedReadings > 0) {
      const totalFlexReadings = sensorData.length * 5;
      const saturationPct =
        (totalSaturatedReadings / totalFlexReadings) * 100;
      console.log(
        `⚠️  Saturation detected: ${totalSaturatedReadings}/${totalFlexReadings} readings (${saturationPct.toFixed(1)}%) at 4095`,
      );
    }

    return normalized;
  }

  private calculateMotionMagnitude(
    sensorData: SensorDataArray,
  ): [number, number] {
    const ax = sensorData[9];
    const ay = sensorData[10];
    const az = sensorData[11];
    const accelMag = Math.sqrt(ax * ax + ay * ay + az * az);

    const gx = sensorData[12];
    const gy = sensorData[13];
    const gz = sensorData[14];
    const gyroMag = Math.sqrt(gx * gx + gy * gy + gz * gz);

    return [accelMag, gyroMag];
  }

  private isMotionSignificant(sensorData: SensorDataArray): boolean {
    const [accelMag, gyroMag] = this.calculateMotionMagnitude(sensorData);
    return (
      accelMag > this.segmenter.motionThreshold ||
      gyroMag > this.segmenter.rotationThreshold
    );
  }

  processFrame(sensorData: SensorDataArray): ProcessFrameResult {
    const seg = this.segmenter;
    const isMoving = this.isMotionSignificant(sensorData);

    if (seg.state === "idle") {
      if (isMoving) {
        seg.state = "start";
        seg.buffer = [sensorData];
        seg.activeCount = 1;
        seg.stableCount = 0;
        return { status: "start" };
      }
      return { status: "idle" };
    } else if (seg.state === "start") {
      seg.buffer.push(sensorData);

      if (isMoving) {
        seg.activeCount += 1;
        seg.stableCount = 0;
        if (seg.activeCount >= seg.minActiveFrames) {
          seg.state = "active";
        }
        return { status: "active", frameCount: seg.buffer.length };
      } else {
        seg.stableCount += 1;
        if (seg.stableCount >= 3) {
          seg.state = "idle";
          seg.buffer = [];
          seg.activeCount = 0;
          return { status: "idle" };
        }
        return { status: "active", frameCount: seg.buffer.length };
      }
    } else if (seg.state === "active") {
      seg.buffer.push(sensorData);

      if (!isMoving) {
        seg.stableCount += 1;
        if (seg.stableCount >= seg.stableFrames) {
          seg.state = "end";
        }
        return { status: "active", frameCount: seg.buffer.length };
      } else {
        seg.stableCount = 0;
        if (seg.buffer.length >= seg.maxGestureFrames) {
          const gestureData = [...seg.buffer];
          this.reset();
          return { status: "end", data: gestureData };
        }
        return { status: "active", frameCount: seg.buffer.length };
      }
    } else if (seg.state === "end") {
      seg.buffer.push(sensorData);

      if (isMoving) {
        seg.state = "active";
        seg.stableCount = 0;
        return { status: "active", frameCount: seg.buffer.length };
      } else {
        seg.stableCount += 1;
        if (seg.stableCount >= seg.stableFrames) {
          if (seg.buffer.length >= seg.minGestureFrames) {
            const gestureData = [...seg.buffer];
            this.reset();
            return { status: "end", data: gestureData };
          } else {
            this.reset();
            return { status: "idle" };
          }
        }
        return { status: "active", frameCount: seg.buffer.length };
      }
    }

    return { status: "idle" };
  }

  /**
   * Prepares gesture data matching Python's approach:
   * 1. If shorter than max_timesteps: pad by repeating the last frame
   * 2. If longer than max_timesteps: truncate to first max_timesteps frames
   */
  prepareGestureData(gestureData: number[][]): number[][] {
    if (!this.config) {
      throw new Error("Config not loaded");
    }

    const maxTimesteps = this.config.max_timesteps;
    let prepared = [...gestureData];

    if (prepared.length < maxTimesteps) {
      const lastFrame = prepared[prepared.length - 1];
      const paddingNeeded = maxTimesteps - prepared.length;
      for (let i = 0; i < paddingNeeded; i++) {
        prepared.push([...lastFrame]);
      }
    } else if (prepared.length > maxTimesteps) {
      prepared = prepared.slice(0, maxTimesteps);
    }

    return prepared;
  }

  async predict(gestureData: SensorDataArray[]): Promise<PredictionResult> {
    if (!this.isReady || !this.model || !this.config) {
      throw new Error("ML Service not initialized");
    }

    const normalized = this.normalizeSensorData(gestureData);
    const prepared = this.prepareGestureData(normalized);

    const flatArray = new Float32Array(
      this.config.max_timesteps * this.config.num_features,
    );
    let index = 0;
    for (const frame of prepared) {
      for (const value of frame) {
        flatArray[index++] = value;
      }
    }

    console.log("Running model inference...");
    const resultData = this.model.predict(flatArray);
    const probabilities = Array.from(resultData);

    const sortedIndices = probabilities
      .map((prob, idx) => ({ prob, idx }))
      .sort((a, b) => b.prob - a.prob);

    const topIdx = sortedIndices[0].idx;
    const topConf = sortedIndices[0].prob;
    const secondConf = sortedIndices.length > 1 ? sortedIndices[1].prob : 0;
    const margin = topConf - secondConf;

    const isConfident =
      topConf >= this.config.confidence_threshold &&
      margin >= this.config.margin_threshold;

    const predictedWord = isConfident ? this.labels[topIdx] : "UNCERTAIN";

    const allProbabilities: ProbabilityItem[] = probabilities.map(
      (prob, idx) => ({
        word: this.labels[idx],
        probability: prob,
      }),
    );

    console.log(`Prediction: ${predictedWord} (${(topConf * 100).toFixed(2)}%)`);

    return {
      word: predictedWord,
      confidence: topConf,
      isConfident,
      margin,
      allProbabilities,
    };
  }

  parseSensorLine(line: string): SensorDataArray | null {
    const parts = line.trim().split(",").map(parseFloat);

    if (parts.length !== 15) {
      console.warn("Invalid sensor data length:", parts.length);
      return null;
    }

    if (parts.some(isNaN)) {
      console.warn("Invalid sensor data contains NaN");
      return null;
    }

    return parts as unknown as SensorDataArray;
  }

  reset(): void {
    this.segmenter.buffer = [];
    this.segmenter.state = "idle";
    this.segmenter.stableCount = 0;
    this.segmenter.activeCount = 0;
  }

  getLabels(): string[] {
    return [...this.labels];
  }

  getConfig(): MLConfig | null {
    return this.config ? { ...this.config } : null;
  }

  destroy(): void {
    this.model = null;
    this.isReady = false;
  }
}

export const mlService = new MLService();
