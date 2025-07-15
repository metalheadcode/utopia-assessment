# 📋 SejookNamastey Dashboard - User Instructions

Welcome to **SejookNamastey**, the digital service management system for Sejuk Sejuk Service Sdn Bhd! This guide will help you understand how to use the dashboard based on your role.

---

## 🔐 Getting Started

### Login Process
1. **Enter your email** on the login page
2. **Check your email** for a magic link (no password needed!)
3. **Click the magic link** to sign in automatically
4. **Access the dashboard** - your role determines what you can see

---

## 👥 User Roles Overview

The system has three main user roles, each with different capabilities:

| Role | Description | Access Level |
|------|-------------|--------------|
| **🔧 Worker (Technician)** | Field technicians who perform AC services | Can manage assigned jobs |
| **👔 Admin (Manager)** | Supervisors who oversee operations | Full access + can act as workers |
| **👤 Client (Customer)** | Customers who request services | Can submit and track orders |

---

## 🔧 For Workers (Technicians)

### What You Can Do:
- ✅ View jobs assigned to you
- ✅ Take available jobs
- ✅ Mark jobs as completed
- ✅ Track your work history

### Using the Jobs Page:

#### 1. **View Your Jobs**
- Navigate to **Dashboard > Jobs**
- See all orders assigned to you
- Jobs are displayed as cards with key information

#### 2. **Take a Job**
- Look for jobs with **"PENDING"** status
- Click **"Take Job"** button
- Job status changes to **"IN PROGRESS"**
- You're now responsible for this job

#### 3. **Complete a Job**
- Find jobs with **"IN PROGRESS"** status
- Click **"Job Completed"** button
- Customer gets automatic email notification
- Job status changes to **"COMPLETED"**

### Job Card Information:
Each job card shows:
- **Service Type**: What needs to be done
- **Price**: Quoted amount (RM)
- **Technician**: Who it's assigned to
- **Status**: Current job state
- **Order ID**: For reference (last 8 characters)

---

## 👔 For Admins (Managers)

### What You Can Do:
- ✅ Everything workers can do
- ✅ Submit new orders for customers
- ✅ View all orders in the system
- ✅ **Act on behalf of workers** (special feature)
- ✅ Manage worker delegations

### Admin Features:

#### 1. **Submit Orders**
- Navigate to **Dashboard > Submit Order**
- Fill in customer details and service requirements
- Assign to appropriate technician
- Set quoted price and add notes

#### 2. **Create Workers**
- Navigate to **Dashboard > Create Worker**
- Add new technicians to your team
- Set yourself as their supervisor automatically
- Send them login links to get started

#### 3. **View All Orders**
- Navigate to **Dashboard > Orders**
- See all orders in the system
- Track overall business operations

#### 4. **Worker Delegation System** (Advanced Feature)

This powerful feature allows admins to take and complete jobs on behalf of workers.

##### Setting Up Delegations:
1. **Go to Jobs page**
2. **Click "Manage Delegations"** button
3. **Select a worker** from the dropdown
4. **Choose permissions**:
   - ✅ **Take Jobs**: Allow taking pending jobs as the worker
   - ✅ **Complete Jobs**: Allow completing jobs as the worker
   - ✅ **Update Job Status**: Allow status changes as the worker
   - ✅ **View Worker Jobs**: Allow viewing worker's jobs
5. **Click "Create Delegation"**

##### Using Delegations:
1. **On the Jobs page**, you'll see a dropdown: **"Act as worker"**
2. **Select a worker** you have delegation for
3. **Badge appears** showing you're acting as that worker
4. **Take/Complete jobs** as if you were that worker
5. **All actions are logged** for audit purposes

##### Important Notes:
- 🔒 **Security**: You can only act for workers you have explicit delegation for
- 📝 **Audit Trail**: All admin actions are logged with both admin and worker IDs
- 👀 **Transparency**: Job cards show when admin performed actions
- ⏰ **Revocation**: Delegations can be revoked anytime

##### First Time Setup Example:
**Scenario**: New admin wants to help workers with jobs

1. **Step 1**: Go to Jobs page → Click "Manage Delegations"
2. **Step 2**: If "Choose a worker" is empty:
   - Go to **Dashboard > Create Worker** to add new workers
   - Fill in worker details and create account
   - Worker automatically becomes your supervisee
3. **Step 3**: Once workers exist, create delegation:
   - Select worker: "john.worker@company.com"
   - Choose permissions: "Take Jobs" + "Complete Jobs"
   - Click "Create Delegation"
4. **Step 4**: Return to Jobs page → Select worker from dropdown
5. **Step 5**: Now you can take/complete jobs as that worker!

#### 4. **Impersonation Indicators**
When acting as a worker:
- 🏷️ **Blue badge** shows "Acting as worker: [worker-id]"
- 🔘 **Button text** changes to "Take Job as [worker-id]"
- 📊 **Job cards** show admin action indicators

---

## 👤 For Clients (Customers)

### What You Can Do:
- ✅ View your submitted orders
- ✅ Track order status
- ✅ See assigned technician information

### Using the System:
1. **Navigate to Dashboard > Orders**
2. **View your order history**
3. **Track status updates**:
   - **PENDING**: Waiting for technician
   - **IN PROGRESS**: Technician is working
   - **COMPLETED**: Work finished

---

## 🎯 Key Features Explained

### Magic Link Authentication
- **No passwords to remember**
- **Secure email-based login**
- **Link expires after use**

### Real-Time Updates
- **Job status changes immediately**
- **Email notifications for completions**
- **Live dashboard updates**

### Audit Trail
- **All actions are logged**
- **Admin impersonation is tracked**
- **Complete transparency**

### Responsive Design
- **Works on desktop and mobile**
- **Touch-friendly interface**
- **Optimized for field use**

---

## 🚨 Troubleshooting

### Can't Login?
1. **Check spam folder** for magic link email
2. **Ensure you're using the correct email**
3. **Contact admin** if persistent issues

### Don't See Expected Jobs?
1. **Refresh the page**
2. **Check if you're in the right role**
3. **Verify with admin about job assignments**

### Admin Can't Act as Worker?
1. **Check if delegation exists** in "Manage Delegations"
2. **Verify delegation permissions**
3. **Ensure delegation hasn't expired**

### "Select a worker" Dropdown is Empty?
This means no delegations exist yet. Here's what to do:

1. **Click "Manage Delegations"** button first
2. **Create a new delegation**:
   - If "Choose a worker" is also empty, go to **Dashboard > Create Worker**
   - Add new workers using the worker creation form
   - Workers automatically get proper roles and profiles
3. **After creating delegation**, the worker will appear in the main dropdown

### Missing Buttons/Features?
1. **Verify your user role**
2. **Check if you have necessary permissions**
3. **Try refreshing the page**

---

## 💡 Best Practices

### For Workers:
- ✅ **Check jobs regularly** for new assignments
- ✅ **Update job status promptly** when starting/finishing work
- ✅ **Complete jobs same day** when possible

### For Admins:
- ✅ **Use delegation sparingly** - mainly for emergencies or support
- ✅ **Set up delegations proactively** for workers you supervise
- ✅ **Review audit logs regularly** for oversight
- ✅ **Revoke unused delegations** to maintain security

### For Everyone:
- ✅ **Keep your profile updated**
- ✅ **Log out when using shared devices**
- ✅ **Report issues immediately**

---

## 📞 Support

If you need help:
1. **Check this guide first**
2. **Ask your supervisor/admin**
3. **Contact IT support** for technical issues

---

## 🔄 System Flow Summary

```
📧 Magic Link Login
    ↓
🏠 Role-Based Dashboard
    ↓
📋 View Available Jobs/Orders
    ↓
🔧 Take/Complete Jobs (Workers)
💼 Manage & Delegate (Admins)
👀 Track Progress (Clients)
    ↓
✅ Job Completion & Notifications
    ↓
📊 Audit & Reporting
```

---

**Happy working with SejookNamastey! 🌟**

*Making AC service management super cool! ❄️*