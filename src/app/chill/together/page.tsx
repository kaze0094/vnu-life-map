import ChillEntry from '@/components/chill/ChillEntry';
export default async function TogetherPage({searchParams}:{searchParams:Promise<{room?:string}>}){const {room}=await searchParams;const roomId=room&&/^r-[a-z0-9]{7,10}-[a-f0-9]{32}$/.test(room)?room:'commons';return <ChillEntry mode="shared" roomId={roomId}/>}
