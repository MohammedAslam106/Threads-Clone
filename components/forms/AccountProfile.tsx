'use client'

import { useForm,SubmitHandler } from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'
import { UserValidation } from "@/lib/validations/user"
import {useUploadThing} from '@/lib/uploadthing'

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
import { Input } from "@/components/ui/input"
import { z } from "zod"
import Image from "next/image"
import { ChangeEvent, useState } from "react"
import { Textarea } from "../ui/textarea"
import { isBase64Image } from "@/lib/utils"
import { usePathname,useRouter } from "next/navigation"
import { updateUser } from "@/lib/actions/user.actions"
interface AccountProfileProps{
    user:{
        id:string,
        objectId:string,
        username:string,
        name:string,
        image:string,
        bio:string
    },
    btnTitle:string
}

export default function AccountProfile({user,btnTitle}:AccountProfileProps ){
    const [files,setFiles]=useState<File[]>([])

    const {startUpload}=useUploadThing("media")

    const form=useForm({
        resolver:zodResolver(UserValidation),
        defaultValues:{
            profile_photo:user?.image || '',
            name:user?.name || '',
            username:user?.username || '',
            bio:user?.bio || ''
        }
    })

    const router=useRouter()
    const pathname=usePathname()


    const handleImage=(e:ChangeEvent<HTMLInputElement>,fieldChange:(value:string)=>void)=>{
        e.preventDefault()

        const fileReader=new FileReader();
        if(e.target.files && e.target.files?.length>0){
            const file=e.target.files[0]
            setFiles(Array.from(e.target.files))
            if(!file.type.includes('image')){
                return
            } 
            
            fileReader.onload=async (event)=>{
                const imageDataUrl=event.target?.result?.toString() || '';
                fieldChange(imageDataUrl)
            }
            fileReader.readAsDataURL(file)
        }

    }
    async function onSubmit(values: z.infer<typeof UserValidation>) {
        const blob=values.profile_photo

        const hasImageChanged=isBase64Image(blob)

        if(hasImageChanged){
            const imgRes=await startUpload(files)
            if(imgRes && imgRes[0].url){
                values.profile_photo=imgRes[0].url
            }
        }

        await updateUser(
            {
            username:values.username,
            name:values.name,
            bio:values.bio,
            image:values.profile_photo,
            userId:user.id,
            path:pathname
            }
        )
        if(pathname==='/profile/edit'){
            router.back();
        }else{
            router.push('/')
        }
    }

    return(
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10">
            <FormField
            control={form.control}
            name="profile_photo"
            render={({ field }) => (
                <FormItem className=" flex items-center gap-4">
                <FormLabel className=" account-form_image-label">
                    {
                        field.value?(
                            <Image priority className=" rounded-full w-full h-full object-center" width={96} height={96} src={field.value} alt="profile photo"/>
                        ):(
                            <Image className="  object-contain  " width={24} height={24} src={'/assets/profile.svg'} alt="profile photo"/>
                        )
                    }
                </FormLabel>
                <FormControl className=" flex-1 text-base-semibold text-gray-200">
                    <Input 
                    placeholder="Upload a photo" 
                    type="file"
                    accept="image/*"
                    className=" account-form_image-input"
                    onChange={(e)=>handleImage(e,field.onChange)}
                    />
                </FormControl>
                <FormMessage/>
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem className=" flex flex-col gap-3 w-full">
                <FormLabel className=" text-base-semibold text-light-2 ">
                    Name
                </FormLabel>
                <FormControl >
                    <Input 
                    // placeholder="Type your name" 
                    type="text"
                    className=" account-form_input no-focus"
                    {...field}
                    />
                </FormControl>
                <FormMessage/>
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                <FormItem className=" flex flex-col gap-3 w-full">
                <FormLabel className=" text-base-semibold text-light-2 ">
                    Username
                </FormLabel>
                <FormControl >
                    <Input 
                    // placeholder="Type your username" 
                    type="text"
                    className=" account-form_input no-focus"
                    {...field}
                    />
                </FormControl>
                <FormMessage/>
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                <FormItem className=" flex flex-col gap-3 w-full">
                <FormLabel className=" text-base-semibold text-light-2 ">
                    Bio
                </FormLabel>
                <FormControl >
                    <Textarea
                    // placeholder="Write your bio" 
                    className=" account-form_input no-focus"
                    {...field}
                    />
                </FormControl>
                <FormMessage/>
                </FormItem>
            )}
            />
            <Button className=" bg-primary-500" type="submit">Submit</Button>
        </form>
    </Form>
    )
}