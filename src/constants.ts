import FindTheNote from "./FindTheNote";
import GetNotesForKey from "./GetNotesForKey";
import GetTriadNotes from "./GetTriadNotes";
import NameTheNote from "./NameTheNote";
import NameTriadNotes from "./NameTriadNotes";

export enum PracticeComponentNames {
  NameTheNote = "Name the note",
  FindTheNote = "Find the note",
  NameTriadNotes = "Name triad notes",
}

export enum HelperComponentNames {
  GetNotesForKey = "Get notes for key",
  GetTriadNotes = "Get triad notes",
}

export const PRACTICE_COMPONENTS = {
  [PracticeComponentNames.NameTheNote]: NameTheNote,
  [PracticeComponentNames.FindTheNote]: FindTheNote,
  [PracticeComponentNames.NameTriadNotes]: NameTriadNotes,
};

export const HELPER_COMPONENTS = {
  [HelperComponentNames.GetNotesForKey]: GetNotesForKey,
  [HelperComponentNames.GetTriadNotes]: GetTriadNotes,
};

export const ALL_LEARNING_COMPONENTS = {
  ...PRACTICE_COMPONENTS,
  ...HELPER_COMPONENTS,
};
