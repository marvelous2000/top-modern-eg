// types/next-intl.d.ts
// This file is used to declare the types for next-intl messages
// so that TypeScript can correctly infer keys for useTranslations.
import 'next-intl';

// Assuming messages are structured with namespaces like HomePage, Projects, etc.
import * as enMessages from '../messages/en.json'; // Import as a module

// Extract the type of the messages object
type Messages = typeof enMessages;

// Declare module augmentation for 'next-intl'
// This merges your Messages type with next-intl's IntlMessages
declare module 'next-intl' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IntlMessages extends Messages {}
}