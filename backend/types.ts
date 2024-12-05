export interface AppConfiguration {
  internalCookie?: string
}

declare global {
  namespace Naily {
    namespace Configuration {
      interface NailyUserConfig {
        app?: AppConfiguration
      }

      interface NailyUserIntelliSense {
        /* Custom `@Value` Decorator intellisense */
        app?: AppConfiguration
      }
    }
  }
}

export {}
