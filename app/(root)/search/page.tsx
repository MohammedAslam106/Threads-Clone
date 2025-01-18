
import ProfileHeader from "@/components/shared/ProfileHeader"
import { profileTabs } from "@/constants"
import { fetchUser, fetchUserPosts, fetchUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList,TabsTrigger } from "@/components/ui/tabs"
import ThreadsTab from "@/components/shared/ThreadsTab"
import UserCard from "@/components/cards/UserCard"



interface pageProps{

}

export default async function Page({}:pageProps ){
    const user=await currentUser()

    if (!user) return null
    
    const userInfo= await fetchUser(user.id)
    if(!userInfo?.onboarded) redirect('/onboarding')

    // Fetch users
    const result=await fetchUsers({
        userId:user.id,
        searchString:'',
        pageNumber:1,
        pageSize:25
    })
    return(
        <section className=''>
            <h1 className=" head-text mb-10">Search</h1>

            {/* Search bar */}

            <div className="mt-14 flex flex-col gap-9">
                {
                    result.users.length===0 ? (
                        <p className="no-result">No users</p>
                    ): (
                        <>
                            {result.users.map((person)=>(
                                <UserCard
                                    key={person.id}
                                    id={person.id}
                                    name={person.name}
                                    username={person.username}
                                    imgUrl={person.image}
                                    personType='User'
                                />
                            ))}
                        </>
                    )
                }
            </div>
        </section>
    )
}