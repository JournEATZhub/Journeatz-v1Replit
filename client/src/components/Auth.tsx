import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Logo from "./Logo";

export default function Auth() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md flex justify-center mb-6">
        <Logo className="w-48 h-48" />
      </div>

      <Card className="w-full max-w-md bg-card rounded-lg">
        <CardContent className="p-0">
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "signup")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger
                value="login"
                className={
                  activeTab === "login"
                    ? "py-3 neon-orange-text border-b-2 neon-orange-border"
                    : "py-3 text-gray-400"
                }
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className={
                  activeTab === "signup"
                    ? "py-3 neon-green-text border-b-2 neon-green-border"
                    : "py-3 text-gray-400"
                }
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="p-6">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup" className="p-6">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
