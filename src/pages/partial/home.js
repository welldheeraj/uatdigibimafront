
export default function Home({data}) {
    console.log(data);
  return (
    <>
    <h1>partial home</h1>
    <button >Click me</button>
    </>
  );
}
export async function getServerSideProps() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await res.json(); // Convert response to JSON
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      props: {
        data: [], // Return an empty array on failure
      },
    };
  }
}


