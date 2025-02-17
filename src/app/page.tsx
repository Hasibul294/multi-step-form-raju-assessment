"use client";
import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/Progressbar";
import PersonalInfo from "@/components/PersonalInfo";
import AddressInfo from "@/components/AddressInfo";
import AccountInfo from "@/components/AccountInfo";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  dob: z.string().min(1, "Date of Birth is required"),
  address1: z.string().min(1, "Address Line 1 is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().regex(/^\d{5}$/, "Invalid Zip Code (only support U.S format)"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function Home() {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ type: "default" | "destructive"; message: string } | null>(null);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      dob: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, trigger, reset } = methods;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setAlert(null);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setAlert({ type: "default", message: "Form submitted successfully!" });
        reset(); 
        setStep(1);
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: "destructive", message: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: Array<keyof FormData> = [];

    if (step === 1) {
      fieldsToValidate = ["name", "email", "dob"];
    } else if (step === 2) {
      fieldsToValidate = ["address1", "city", "state", "zip"];
    } else if (step === 3) {
      fieldsToValidate = ["username", "password", "confirmPassword"];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-6">
        <ProgressBar steps={3} currentStep={step} />
        {step === 1 && <PersonalInfo />}
        {step === 2 && <AddressInfo />}
        {step === 3 && <AccountInfo />}
        
        {/* Alert Messages */}
        {alert && (
          <Alert variant={alert.type} className="mt-4">
            {alert.type === "destructive" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertTitle>{alert.type === "destructive" ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        {/* Button section */}
        <div className="flex justify-between">
          {step > 1 && <Button type="button" onClick={prevStep}>Previous</Button>}
          {step < 3 ? (
            <Button type="button" onClick={nextStep}>Next</Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span> : "Submit"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
