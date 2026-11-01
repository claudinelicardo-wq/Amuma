import { Redirect } from 'expo-router';

/** Group entry point: the router lands here when the onboarding group is activated. */
export default function OnboardingIndex() {
  return <Redirect href="/welcome" />;
}
