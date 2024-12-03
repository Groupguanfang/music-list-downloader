export interface AppConfiguration {
  // Custom your configuration
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
