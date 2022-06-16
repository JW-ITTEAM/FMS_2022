import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function blank({ Cookie }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const router = useRouter();
  useEffect(() => {
    !TOKEN && router.push("/login");
  }, []);

  return (
    <Layout TOKEN={TOKEN} TITLE="Blank">
      <h3>Blank Page</h3>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );

  // Pass data to the page via props
  return { props: { Cookie: cookies } };
}
