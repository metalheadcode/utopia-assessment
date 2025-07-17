"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminInvitationForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
    loginUrl?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/demo-admin-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          type: 'success',
          message: data.message,
          loginUrl: data.loginUrl
        });
        setEmail("");
      } else {
        setResult({
          type: 'error',
          message: data.error || 'Failed to send invitation'
        });
      }
    } catch {
      setResult({
        type: 'error',
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="w-5 h-5" />
          <span>Try Admin Invitation</span>
        </CardTitle>
        <CardDescription>
          Enter your email to receive an admin invitation for the demo system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result?.type !== 'success' && <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="interviewer@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending Invitation...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Admin Invitation
              </>
            )}
          </Button>
        </form>}

        {/* result?.type === "error" && result.message === "User is already an admin" */}
        {result?.type === "error" && result.message === "User is already an admin" && (
          <div className="space-y-2 mt-2">
            <p>You are already an admin. Click here to login.</p>
            <Link href="/login" className="text-stone-600 hover:text-stone-800 underline text-center">
              <Button className="w-full">
                Login
              </Button>
            </Link>
          </div>
        )}

        {result && (
          <Alert className={`mt-4 ${result.type === 'success' ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
            {result.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <AlertDescription className={result.type === 'success' ? 'text-emerald-800' : 'text-red-800'}>
              {result.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}