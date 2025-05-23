// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Error {}
    interface Locals {}
    interface PageLoad {}
    interface PageData {}
    interface PageState {}
    interface Platform {}
    interface User {
      sub: string;
      email: string;
      userType: string;
      businessName?: string;
    }
  }
}

export {};
