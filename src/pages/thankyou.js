import { useRouter } from "next/router";
export default function ThankYou() {
    const router = useRouter();
    const query = router.query;
    console.log(query.policy_id);
    console.log(query.policyurl);
    console.log(query.policy_id);
    return (
        <div>
            <h1>Thank You</h1>
        </div>
    )
}