
import ProfileHeader from "@/components/shared/ProfileHeader"
import { communityTabs } from "@/constants"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import { Tabs, TabsContent, TabsList,TabsTrigger } from "@/components/ui/tabs"
import ThreadsTab from "@/components/shared/ThreadsTab"
import { fetchCommunityDetails } from "@/lib/actions/community.actions"
import UserCard from "@/components/cards/UserCard"



interface pageProps{
    params:{id:string}
}

async function Page({params}:pageProps ){
    const user=await currentUser()

    if (!user) return null
    
    const communityDetails=await fetchCommunityDetails(params.id)
    return(
        <section className=''>
            <ProfileHeader 
                accountId={communityDetails.id}
                authUserId={user.id}
                name={communityDetails.name}
                username={communityDetails.username}
                imageUrl={communityDetails.image}
                bio={communityDetails.bio}
                type="Community"
            />

            <div className=" mt-9">
                <Tabs defaultValue="threads" className=" w-full">
                    <TabsList className=" tab">
                        {communityTabs.map((tab)=>{
                            return(
                                <TabsTrigger className=" tab " key={tab.label} value={tab.value}>
                                    <Image
                                        src={tab.icon}
                                        alt={tab.label}
                                        width={24}
                                        height={24}
                                        className=" object-contain"
                                    />
                                    <p className=" max-sm:hidden">{tab.label}</p>
                                    {tab.label==='Threads' && (
                                        <p className=" ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                            {communityDetails?.threads?.length}
                                        </p>
                                    )}
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>
                        <TabsContent className=" w-full text-light-1" value={'threads'} >
                            <ThreadsTab
                                currentUserId={user.id}
                                accountId={communityDetails._id}
                                accountType="Community"
                            />
                        </TabsContent>

                        {/* Memebers */}
                        <TabsContent className=" w-full text-light-1" value={'members'} >
                            <section className="mt-9 flex flex-col gap-10">
                                {communityDetails?.members?.map((member:any)=>(
                                    <UserCard
                                        key={member.id}
                                        id={member.id}
                                        name={member.name}
                                        username={member.username}
                                        imgUrl={member.image}
                                        personType='User'
                                    />
                                ))}
                            </section>
                        </TabsContent>

                        <TabsContent className=" w-full text-light-1" value={'requests'} >
                            <ThreadsTab
                                currentUserId={user.id}
                                accountId={communityDetails._id}
                                accountType="Community"
                            />
                        </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}

export default Page