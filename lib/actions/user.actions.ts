"use server"
import {connectToDB} from '@/lib/mongoose'
import User from '../models/user.model'
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import { FilterQuery, SortOrder } from 'mongoose';

interface User{
    userId:string,
    username:string,
    name:string,
    bio:string,
    image:string,
    path:string
}

export async function updateUser(
    {userId,
    username,
    name,
    bio,
    image,
    path}:User
    ):Promise<void>{
    connectToDB()
        try {
            await User.findOneAndUpdate(
                {id:userId},
                {
                    username:username.toLowerCase(),
                    name,
                    bio,
                    image,
                    onboarded:true,
                },
                {upsert:true}  //This is to updated existing row if not exist to insert one
        
        
                );
            
                if(path==='/profile/edit'){
                    revalidatePath(path)
                }
        } catch (error:any) {
            throw new Error(`Failed to create/update user: ${error.message}`)
        }

}

export async function fetchUser(id:string){
    try {
        connectToDB()
        const res=await User.findOne({
            id:id
        })
        // .populate({model:'Coummunity',path:'communities'}).populate({model:'Thread',path:'threads'})
        if(res){
            return res
        }else return "User not found"
    } catch (error:any) {
        console.log(`Internal server error: ${error.message}`)
        throw new Error(error.message)
    }
}

export async function fetchUserPosts(userId:string){
    try {
        connectToDB()

        //Find all threads authored by user with given userId

        // TODO: Populate Community
        const threads=await User.findOne({id:userId})
        .populate({
            path:'threads',
            model:Thread,
            populate:{
                path:'children',
                model:Thread,
                populate:{
                    path:'author',
                    model:User,
                    select:'name image id'
                }
            }
        }).exec()
        return threads
    } catch (error:any) {
        throw new Error(`Failed to fetch post: ${error.message}`)
    }
}

export async function fetchUsers({
    userId,
    searchString='',
    pageNumber=1,
    pageSize=20,
    sortBy='desc'
}:{
    userId:string
    searchString?:string
    pageNumber?:number
    pageSize?:number;
    sortBy?:SortOrder
}
){
    try {
        connectToDB()

        const skipAmount=(pageNumber-1) * pageSize

        const regex=new RegExp(searchString, 'i');

        const query:FilterQuery<typeof User>={
            id:{$ne:userId}
        }

        if(searchString.trim() !==''){
            query.$or=[
                {username:{
                    $regex:regex
                }},
                {name:{
                    $regex:regex
                }}
            ]
        }

        const sortOptions={createdAt:sortBy};

        const usersQuery=User.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize)

        const totalUsersCount=await User.countDocuments(query);

        const users=await usersQuery.exec()

        const isNext=totalUsersCount>skipAmount+users.length

        return {users,isNext};
    } catch (error:any) {
        throw new Error(`Faild to fetch users: ${error.message}`)
    }
}

export async function getActivity({userId}:{userId:string}){
    try {
        connectToDB()

        //Find all the threads created by the user
        const userThreads=await Thread.find({author:userId});

        //Collect all the child thread ids (replies) from the 'Children' field
        const childThreadIds=userThreads.reduce((acc,userThread)=>{
            return acc.concat(userThread.children)
        },[])

        const replies=await Thread.find({
            _id: {$in:childThreadIds},
            author:{$ne:userId}
        }).populate({
            path:'author',
            model:User,
            select:'name image _id'
        })

        return replies
    } catch (error:any) {
        throw new Error(`Failed to fetch activity: ${error.message}`)
    }
}