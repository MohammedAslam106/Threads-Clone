import { fetchUserPosts } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import ThreadCard from "../cards/ThreadCard"
import { fetchCommunityPosts } from "@/lib/actions/community.actions"

interface ThreadsTabProps{
    currentUserId:string
    accountId:string
    accountType:string
}

export default async function ThreadsTab(
    {
    currentUserId,
    accountId,
    accountType,}:ThreadsTabProps ){

        const result=accountType=='Community' ? await fetchCommunityPosts(accountId) : await fetchUserPosts(accountId)

        // result.threads.forEach((t:any)=>console.log(t.text))
        if(!result) redirect('/')
    return(
        <section className=' mt-9 flex flex-col gap-10 '>
            {result.threads.map((thread:any)=>{
                return (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType==='User' ?
                        {name:result.name,image:result.image,id:result.id}:
                        {name:thread.author.name,image:thread.author.image,id:thread.author.id}
                    }
                    community={thread.community} //TODO
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />)
            })}
        </section>
    )
}