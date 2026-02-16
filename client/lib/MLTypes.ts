export type SensorDataArray = [
  number, number, number, number, number,
  number, number, number, number,
  number, number, number,
  number, number, number,
];

export interface NormalizationParams {
  flex_min: number[];
  flex_max: number[];
  feature_means: number[];
  feature_stds: number[];
}

export interface MLConfig {
  max_timesteps: number;
  num_features: number;
  confidence_threshold: number;
  margin_threshold: number;
  motion_threshold: number;
  rotation_threshold: number;
  stable_frames: number;
  min_gesture_frames: number;
  max_gesture_frames: number;
  normalization: NormalizationParams;
}

export interface GestureSegmenterConfig {
  buffer: SensorDataArray[];
  stableCount: number;
  motionThreshold: number;
  rotationThreshold: number;
  stableFrames: number;
  minGestureFrames: number;
  maxGestureFrames: number;
  state: "idle" | "start" | "active" | "end";
  activeCount: number;
  minActiveFrames: number;
}

export interface ProcessFrameResult {
  status: "idle" | "start" | "active" | "end";
  data?: SensorDataArray[];
  frameCount?: number;
}

export interface ProbabilityItem {
  word: string;
  probability: number;
}

export interface PredictionResult {
  word: string;
  confidence: number;
  isConfident: boolean;
  margin: number;
  allProbabilities: ProbabilityItem[];
}
