"use server"

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createJobAction(formData) {
    await dbConnect();


    const session = await getServerSession(authOptions);

    if (!session) {
        return { success: false, error: "You must be logged in!" };
    }
    try {
        const title = formData.get("title")
        const company = formData.get("company")
        const status = formData.get("status")

        await Job.create({
            title,
            company,
            status,
            userId: session.user.id,
        })

        revalidatePath('/');

        return { success: true }
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create job" };
    }
}


export async function getJobStats() {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session) return { pending: 0, interview: 0, rejected: 0, total: 0 };

    const stats = await Job.aggregate([
        {
            $match:{userId:session.user.id}
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])

    console.log(stats, 'stats')

    const formattedData = stats.reduce((acc, curr) => {
        acc[curr._id] = curr.count

        return acc
    }, {})


    return {
        pending: formattedData?.pending || 0,
        interview: formattedData?.interview || 0,
        rejected: formattedData?.rejected || 0,
        total: stats.reduce((sum, item) => sum + item.count, 0),
    }
}

export async function deleteApplication(id) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    try {
        if (!id) {
            throw new Error("ID Not Found")
        };

        const deleteApp = await Job.findByIdAndDelete({_id:id,userId:session.user.id})

        if (deleteApp) {
            revalidatePath("/");
            return { success: true, message: 'Application Deleted SuccessFully' }
        } else {
            return { success: false, message: 'Application not Delete' }
        }

    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to Delete job" };
    }

}