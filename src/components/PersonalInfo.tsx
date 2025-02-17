import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import Typography from "./ui/Typography";

export default function PersonalInfo() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <Typography as="h2" type="h2">Personal Information</Typography>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name", { required: "Name is required" })} />
        {errors.name && <p className="text-red-500 text-xs">{String(errors.name.message)}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} />
        {errors.email && <p className="text-red-500 text-xs">{String(errors.email.message)}</p>}
      </div>
      {/* New Phone Number Field */}
      <div>
        <Label>Phone Number</Label>
        <Input {...register("phone")} />
        {errors.phone && <p className="text-red-500 text-xs">{String(errors.phone.message)}</p>}
      </div>
      <div>
        <Label htmlFor="dob">Date of Birth</Label>
        <Input id="dob" type="date" {...register("dob", { required: "Date of Birth is required" })} />
        {errors.dob && <p className="text-red-500 text-xs">{String(errors.dob.message)}</p>}
      </div>
    </div>
  );
}