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

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  dob: z.string().min(1, "Date of Birth is required"),
  address1: z.string().min(1, "Address Line 1 is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().regex(/^\d{5}$/, "Invalid Zip Code (only support U.S formate)"),
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

  // provide default values
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

  const { handleSubmit, trigger } = methods;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    // Handle API submission here
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
        <div className="flex justify-between">
          {step > 1 && <Button type="button" onClick={prevStep}>Previous</Button>}
          {step < 3 ? <Button type="button" onClick={nextStep}>Next</Button> : <Button type="submit">Submit</Button>}
        </div>
      </form>
    </FormProvider>
  );
}
