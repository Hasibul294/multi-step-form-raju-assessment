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
  phone: z.string().regex(/^\d{11}$/, "Phone number must be 11 digits"), // New field with custom validation
  address1: z.string().min(1, "Address Line 1 is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().regex(/^\d{5}$/, "Invalid Zip Code (only support U.S format)"),
  username: z.string().min(1, "Username is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
  terms: z.boolean().refine(value => value === true, {
    message: "You must accept the terms and conditions",
  }), // New field with custom validation
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
      phone: "",  // Added phone number field
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false, // Added terms checkbox
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
      fieldsToValidate = ["name", "email", "phone", "dob"];
    } else if (step === 2) {
      fieldsToValidate = ["address1", "city", "state", "zip"];
    } else if (step === 3) {
      fieldsToValidate = ["username", "password", "confirmPassword", "terms"];
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
        
        <div className="shadow-lg rounded-md p-4">
          <div
            className={`transition-opacity duration-500 ${step === 1 ? 'opacity-100' : 'opacity-0'}`}
          >
            {step === 1 && <PersonalInfo />}
          </div>
          <div
            className={`transition-opacity duration-500 ${step === 2 ? 'opacity-100' : 'opacity-0'}`}
          >
            {step === 2 && <AddressInfo />}
          </div>
          <div
            className={`transition-opacity duration-500 ${step === 3 ? 'opacity-100' : 'opacity-0'}`}
          >
            {step === 3 && <AccountInfo />}
          </div>
        </div>
        
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
