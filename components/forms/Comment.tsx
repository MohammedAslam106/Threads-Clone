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
import { Input } from "../ui/input"
import { usePathname,useRouter } from "next/navigation"
import { updateUser } from "@/lib/actions/user.actions"
import { CommentValidation } from "@/lib/validations/thread"
import { addCommentToThread, createThread } from "@/lib/actions/thread.actions"
import Image from "next/image"


interface CommentProps{
    threadId:string,
    currentUserImage:string,
    currentUserId:string
}

export default function Comment({threadId,currentUserId,currentUserImage}:CommentProps ){

    const router=useRouter()
    const pathname=usePathname()
    const form=useForm({
        resolver:zodResolver(CommentValidation),
        defaultValues:{
            thread:'',
        }
    })

    async function onSubmit(values: z.infer<typeof CommentValidation>) {
        
        await addCommentToThread(threadId,values.thread,JSON.parse(currentUserId),pathname)


        form.reset();
    }
    return(
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form">
                    <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                <FormItem className=" flex items-center gap-3 w-full">
                <FormLabel >
                    <Image 
                    src={currentUserImage} 
                    alt="Profile Image"
                    width={48}
                    height={48}
                    className=" rounded-full object-cover"
                    />
                </FormLabel>
                <FormControl className=" border-none bg-transparent">
                    <Input
                    placeholder="Comment..." 
                    type={'text'}
                    className=" no-focus text-light-1 outline-none"
                    {...field}
                    />
                </FormControl>
                </FormItem>
            )} />
            <Button className=" comment-form_btn" type="submit">
                Reply
            </Button>
                </form>
            </Form>
        </>
    )
}