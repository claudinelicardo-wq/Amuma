import { Redirect } from 'expo-router';

/** Group entry point: the router lands here when the auth group is activated. */
export default function AuthIndex() {
  return <Redirect href="/sign-in" />;
}
