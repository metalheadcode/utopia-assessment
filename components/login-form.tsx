"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useAuth } from "@/app/context/auth-context"
import { toast } from "sonner"
import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { sendLoginLink } = useAuth()
  const [isSending, setIsSending] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = (e.target as HTMLFormElement).email.value
    if (!email) {
      toast.error("Please enter an email")
      return
    }

    try {
      await sendLoginLink(email)
      toast.success("Sign in link sent to email")
      setIsSending(true);
    } catch (error) {
      toast.error("Failed to send sign in link")
      console.error('ERROR RESPONSE', error)
    }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>

      {isSending && (
        <div className="flex justify-center items-center bg-black text-white p-2 rounded-md text-sm">
          <p>If you haven&apos;t received the email, please check your <span className="font-bold">spam</span> or <span className="font-bold">junk mail</span> folder.</p>
        </div>
      )}


      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold mb-3">Hi there! 👋🏻</h1>
                <p className="text-balance text-black/70 mb-1">
                  Login to your SejookNamastey account
                </p>
                <small className="text-muted-foreground text-xs">by Sejuk Sejuk Services Sdn Bhd</small>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <Button disabled={isSending} type="submit" className="w-full">
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image priority={true} src="/images/login.webp" alt="Image" className="absolute inset-0 h-auto w-full object-contain" height={650} width={650} />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link href="/terms-of-service">Terms of Service</Link>{" "}
        and <Link href="/privacy-policy">Privacy Policy</Link>.
      </div>
    </div>
  )
}
