import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Typography from "./ui/Typography";

const states = ["California", "Texas", "New York", "Florida", "Illinois"]; // Example states

export default function AddressInfo() {
  const { register, setValue, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
       <Typography as="h2" type="h2">Address Information</Typography>
      <div>
        <Label htmlFor="address1">Address Line 1</Label>
        <Input id="address1" {...register("address1", { required: "Address Line 1 is required" })} />
        {errors.address1 && <p className="text-red-500">{String(errors.address1.message)}</p>}
      </div>
      <div>
        <Label htmlFor="address2">Address Line 2</Label>
        <Input id="address2" {...register("address2")} />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" {...register("city", { required: "City is required" })} />
        {errors.city && <p className="text-red-500">{String(errors.city.message)}</p>}
      </div>
      <div>
        <Label htmlFor="state">State</Label>
        <Select onValueChange={(value: string) => setValue("state", value)}> {/* React Hook Form integration */}
          <SelectTrigger>
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.state && <p className="text-red-500">{String(errors.state.message)}</p>}
      </div>
      <div>
        <Label htmlFor="zip">Zip Code</Label>
        <Input id="zip" {...register("zip", { required: "Zip Code is required", pattern: { value: /^\d{5}$/, message: "Invalid Zip Code" } })} />
        {errors.zip && <p className="text-red-500">{String(errors.zip.message)}</p>}
      </div>
    </div>
  );
}
