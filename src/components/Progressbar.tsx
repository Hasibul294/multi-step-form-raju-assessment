type ProgressBarProps = {
  steps: number;
  currentStep: number;
};

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="w-full">
      {/* Step Label */}
      <p className="text-center mb-2 font-medium text-gray-700 dark:text-gray-300">
        Step {currentStep} of {steps}
      </p>

      {/* Progress Bar */}
      <div className="relative w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}