import { useUserStore } from "@/store/user";
import { PanelChildrens } from "~/constants/pages";

const hasNotAccessToMetaPermission = (meta) => {
  return (
    meta?.length && meta[0].permission && !$permissions.can(meta[0].permission)
  );
};

export default defineNuxtRouteMiddleware((to, from) => {
  // if (to.params.id === "1") {
  //   return abortNavigation();
  // }
  // // In a real app you would probably not redirect every route to `/`
  // // however it is important to check `to.path` before redirecting or you
  // // might get an infinite redirect loop
  // if (to.path !== "/") {
  //   return navigateTo("/");
  // }

  if (process.server) return;

  const route = useRoute();
  const userStore = useUserStore();

  if (!userStore.user) redirect({ name: "login" });

  const matchedRoute = route.matched.length ? route.matched[0] : null;
  if (matchedRoute?.path) {
    const foundRoute = Object.values(PanelChildrens)
      .map((val) => val.items)
      .flat()
      .find((val) => val?.path?.indexOf(matchedRoute?.path) >= 0);

    if (
      (foundRoute?.roles &&
        store.state.userData?.roles?.some((userRole) =>
          foundRoute.roles?.includes(userRole.name),
        ) == false) ||
      hasNotAccessToMetaPermission(route.meta)
    ) {
      toast.error("دسترسی به این صفحه ممکن نیست.");
      navigateTo("/");
    }
  } else redirect({ name: "login" });
});
