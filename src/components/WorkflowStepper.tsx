import { useState } from "react";

const WorkflowStepper = () => {
  const [currentStep] = useState(0);

  const steps = [
    { label: "1. Initialisé", color: "bg-blue-900 text-white" },
    { label: "2. Validé", color: "bg-blue-900 text-white" },
    { label: "3. Confirmé", color: "bg-blue-900 text-white" },
    { label: "4. Publié", color: "bg-blue-900 text-white" },
  ];

  return (
    <div className="w-full px-6 py-8">
      <div className="mx-auto w-full ">
        <div className="flex w-full items-center">
          {steps.map((step, index) => {
            const isActive = index <= currentStep;

            return (
              <div key={step.label} className="flex flex-1 items-center">
                <div
                  className={`
                    relative flex-1 py-5 text-center text-sm md:text-base font-semibold
                    transition-all duration-300 shadow-md ${step.color}
                    ${
                      isActive
                        ? "opacity-100 scale-105 hover:scale-110 duration-300 cursor-pointer"
                        : "opacity-80 text-white/80 hover:scale-105 text-gray-400"
                    }
                  `}
                  style={{
                    clipPath:
                      index === steps.length
                        ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                        : "polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%, 24px 50%)",
                  }}
                >
                  <span className="relative z-10 tracking-wide">
                    {step.label}
                  </span>
                </div>

                {/* Overlap */}
                {index < steps.length - 1 && <div className="-ml-6" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkflowStepper;
