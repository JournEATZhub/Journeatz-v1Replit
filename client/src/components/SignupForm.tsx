import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "../hooks/useAuth";

interface SignupFormData {
  email: string;
  password: string;
  role: "admin" | "driver" | "kitchen" | "customer";
}

export default function SignupForm() {
  const { signup } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      email: "",
      password: "",
      role: "customer",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const { error } = await signup(data.email, data.password, data.role);
      if (error) {
        throw error;
      }
      
      // Form is reset and toast message is handled in the AuthProvider
      // The provider will also try auto-login for development
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="signup-email" className="text-sm font-medium text-gray-300 mb-1">
          Email
        </Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF00]"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="signup-password" className="text-sm font-medium text-gray-300 mb-1">
          Password
        </Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Create a password"
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF00]"
          {...register("password", { 
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            }
          })}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="role" className="text-sm font-medium text-gray-300 mb-1">
          Role
        </Label>
        <Select 
          onValueChange={(value) => 
            setValue("role", value as "admin" | "driver" | "kitchen" | "customer")
          } 
          defaultValue="customer"
        >
          <SelectTrigger className="w-full px-4 py-3 bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00FF00]">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent className="bg-muted border-gray-700">
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="driver">Driver</SelectItem>
            <SelectItem value="kitchen">Kitchen</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-[#00FF00] text-black font-bold rounded-md hover:bg-opacity-90 transition-all shadow-[0_0_15px_#00FF00]"
      >
        {isLoading ? "Signing up..." : "Sign Up"}
      </Button>
    </form>
  );
}
