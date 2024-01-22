'use client'

import { useForm } from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { ChangeEvent, useState } from "react"
import { Textarea } from "../ui/textarea"
import { usePathname,useRouter } from "next/navigation"
import { updateUser } from "@/lib/actions/user.actions"
import { ThreadValidation } from "@/lib/validations/thread"
import { createThread } from "@/lib/actions/thread.actions"
import { useOrganization } from "@clerk/nextjs"
    
interface PostThreadProps{
    userId:string
}

export default function PostThread({userId}:PostThreadProps ){
    const router=useRouter()
    const pathname=usePathname()
    const {organization}=useOrganization()
    const form=useForm({
        resolver:zodResolver(ThreadValidation),
        defaultValues:{
            thread:'',
            accountId:userId
        }
    })

    async function onSubmit(values: z.infer<typeof ThreadValidation>) {
        
        await createThread({
            text:values.thread,
            author:userId,
            communityId:organization ? organization.id : null,
            path:pathname
        })

        router.push('/')
    }


    return(
        <div className=''>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className="mt-10 flex flex-col justify-start gap-10">
                    <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                <FormItem className=" flex flex-col gap-3 w-full">
                <FormLabel className=" text-base-semibold text-light-2 ">
                    Content
                </FormLabel>
                <FormControl className=" no-focus border border-dark-4 bg-dark-3 text-light-1">
                    <Textarea
                    // placeholder="Write your bio" 
                    rows={15}
                    className=" account-form_input no-focus"
                    {...field}
                    />
                </FormControl>
                <FormMessage/>
                </FormItem>
            )} />
            <Button className=" bg-primary-500" type="submit">
                Post Thread
            </Button>
                </form>
            </Form>
        </div>
    )
}