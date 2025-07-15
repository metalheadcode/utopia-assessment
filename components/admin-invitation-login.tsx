"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoginForm } from './login-form'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { Crown, Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/app/context/auth-context'
import { Timestamp } from 'firebase/firestore'

interface AdminInvitation {
    id: string
    email: string
    invitedBy: string
    invitedByEmail: string
    status: 'pending' | 'accepted' | 'expired'
    createdAt: Timestamp
    expiresAt: Timestamp
}

export function AdminInvitationLogin() {
    const searchParams = useSearchParams()
    const invitationId = searchParams.get('invitation')
    const { sendLoginLink } = useAuth()

    const [invitation, setInvitation] = useState<AdminInvitation | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [acceptingInvitation, setAcceptingInvitation] = useState(false)

    useEffect(() => {
        if (invitationId) {
            fetchInvitation(invitationId)
        }
    }, [invitationId])

    const fetchInvitation = async (id: string) => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`/api/get-admin-invitation?id=${id}`)
            const data = await response.json()

            if (response.ok) {
                setInvitation(data.invitation)

                // Check if invitation is expired
                let expiryDate: Date | null = null;
                if (data.invitation.expiresAt) {
                    if (typeof data.invitation.expiresAt.toDate === 'function') {
                        expiryDate = data.invitation.expiresAt.toDate();
                    } else if (data.invitation.expiresAt._seconds) {
                        expiryDate = new Date(data.invitation.expiresAt._seconds * 1000);
                    } else if (data.invitation.expiresAt instanceof Date) {
                        expiryDate = data.invitation.expiresAt;
                    }
                }

                if (data.invitation.status === 'expired' || (expiryDate && expiryDate < new Date())) {
                    setError('This invitation has expired. Please contact the admin for a new invitation.')
                } else if (data.invitation.status === 'accepted') {
                    setError('This invitation has already been accepted.')
                }
            } else {
                setError(data.error || 'Invalid invitation link')
            }
        } catch (error) {
            console.error('Error fetching invitation:', error)
            setError('Failed to load invitation')
        } finally {
            setLoading(false)
        }
    }

    const acceptInvitation = async () => {
        if (!invitation) return

        try {
            setAcceptingInvitation(true)

            // Send login link for the invited email
            await sendLoginLink(invitation.email)

            // Mark invitation as accepted
            const response = await fetch('/api/accept-admin-invitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    invitationId: invitation.id,
                    email: invitation.email
                })
            })

            if (response.ok) {
                toast.success('Invitation accepted! Check your email for the login link.')
                setInvitation(prev => prev ? { ...prev, status: 'accepted' } : null)
            } else {
                const data = await response.json()
                throw new Error(data.error || 'Failed to accept invitation')
            }
        } catch (error) {
            console.error('Error accepting invitation:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to accept invitation')
        } finally {
            setAcceptingInvitation(false)
        }
    }

    // Show invitation-specific UI if invitation ID is present
    if (invitationId) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Crown className="h-12 w-12 text-yellow-500" />
                    </div>
                    <CardTitle className="text-2xl">Admin Invitation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <span className="ml-2">Loading invitation...</span>
                        </div>
                    ) : error ? (
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : invitation ? (
                        <div className="space-y-4">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold mb-2">You&apos;ve been invited to become an admin!</h3>
                                <p className="text-muted-foreground text-sm">
                                    {invitation.invitedByEmail} has invited you to join as an administrator.
                                </p>
                            </div>

                            <div className="bg-muted p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Invited Email:</span>
                                    <Badge variant="outline">{invitation.email}</Badge>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Invited By:</span>
                                    <span className="text-sm">{invitation.invitedByEmail}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Status:</span>
                                    <Badge variant={invitation.status === 'pending' ? 'default' : 'secondary'}>
                                        {invitation.status}
                                    </Badge>
                                </div>
                            </div>

                            {invitation.status === 'pending' && (
                                <div className="space-y-4">
                                    <Alert>
                                        <Mail className="h-4 w-4" />
                                        <AlertDescription>
                                            Click &quot;Accept Invitation&quot; to receive a login link at {invitation.email}.
                                            You&apos;ll automatically be given admin privileges upon first login.
                                        </AlertDescription>
                                    </Alert>

                                    <Button
                                        onClick={acceptInvitation}
                                        disabled={acceptingInvitation}
                                        className="w-full"
                                    >
                                        {acceptingInvitation ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Accepting...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Accept Invitation
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}

                            {invitation.status === 'accepted' && (
                                <Alert>
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Invitation accepted! Check your email for the login link.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        )
    }

    // Show regular login form if no invitation
    return <LoginForm />
}