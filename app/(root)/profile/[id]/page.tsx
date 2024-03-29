
import ProfileHeader from "@/components/shared/ProfileHeader"
import { profileTabs } from "@/constants"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList,TabsTrigger } from "@/components/ui/tabs"
import ThreadsTab from "@/components/shared/ThreadsTab"



interface pageProps{
    params:{id:string}
}

async function Page({params}:pageProps ){
    const user=await currentUser()

    if (!user) return null
    
    const userInfo= await fetchUser(params.id)
    
    if(!userInfo?.onboarded) redirect('/onboarding')
    return(
        <section className=''>
            <ProfileHeader 
                accountId={userInfo.id}
                authUserId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                imageUrl={userInfo.image}
                bio={userInfo.bio}
            />

            <div className=" mt-9">
                <Tabs defaultValue="threads" className=" w-full">
                    <TabsList className=" tab">
                        {profileTabs.map((tab)=>{
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
                                            {userInfo?.threads?.length}
                                        </p>
                                    )}
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>
                    {profileTabs.map((tab)=>{
                        return(
                            <TabsContent className=" w-full text-light-1" value={tab.value} key={`content-${tab.value}`}>
                                <ThreadsTab
                                    currentUserId={user.id}
                                    accountId={userInfo.id}
                                    accountType="User"
                                />
                            </TabsContent>
                        )
                    })}
                </Tabs>
            </div>
        </section>
    )
}

export default Page