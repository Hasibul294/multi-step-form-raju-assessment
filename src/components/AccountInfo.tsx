import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";
import Typography from "./ui/Typography";

export default function AccountInfo() {
  const { register, watch, formState: { errors } } = useFormContext();
  const password = watch("password");

  return (
    <div className="space-y-4">
       <Typography as="h2" type="h2">Account Information</Typography>
      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...register("username", { required: "Username is required" })} />
        {errors.username && <p className="text-red-500 text-xs">{String(errors.username.message)}</p>}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password", { required: "Password is required" })} />
        {errors.password && <p className="text-red-500 text-xs">{String(errors.password.message)}</p>}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" type="password" {...register("confirmPassword", { required: "Confirm Password is required", validate: value => value === password || "Passwords do not match" })} />
        {errors.confirmPassword && <p className="text-red-500 text-xs">{String(errors.confirmPassword.message)}</p>}
      </div>
       {/* New Terms & Conditions Checkbox */}
      <div>
      <div className="flex items-center space-x-2">
        <Checkbox {...register("terms")} id="terms" />
        <Label htmlFor="terms">I accept the Terms & Conditions</Label>
      </div>
      {errors.terms && <p className="text-red-500 text-xs">{String(errors.terms.message)}</p>}
      </div>
    </div>
  );
}