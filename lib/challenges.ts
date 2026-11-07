/**
 * Card wording is transcribed from the printed Magic Kingdom card.
 * Line wraps were removed. Spelling, capitalization, punctuation, and
 * printed times are unchanged. Do not "fix" Momento, mosiac, Whiff-sistant, or similar.
 * Plain-language steps are separate help. They are not the card.
 */

export type Challenge = {
  text: string;
  icon: string;
  iconWord: string;
  steps: string[];
  parkNote: string | null;
};

export const CHALLENGES: readonly Challenge[] = [
  {
    text: "Take a pic with the castle",
    icon: "castle",
    iconWord: "Castle",
    steps: [
      "Walk until you see the big castle.",
      "Stand together so the castle is behind you.",
      "Take a photo. A pic means a photo.",
    ],
    parkNote: null,
  },
  {
    text: "See if Walt's light is on above the fire station",
    icon: "lamp",
    iconWord: "Light",
    steps: [
      "Find the fire station on Main Street.",
      "Look in the window above the station.",
      "See whether a small light is on.",
    ],
    parkNote: null,
  },
  {
    text: "Ride a Main st vehicle",
    icon: "vehicle",
    iconWord: "Ride",
    steps: [
      "Stay on Main Street. Main st means Main Street.",
      "Pick a vehicle you can ride, such as a horse trolley or a little car.",
      "Ride it one time.",
    ],
    parkNote: "These vehicles are not out all day. Ask a cast member. A cast member is a park worker.",
  },
  {
    text: "Find Tramp and Lady's footprints outside of Tony's",
    icon: "paw",
    iconWord: "Paws",
    steps: [
      "Go to Tony's Town Square Restaurant.",
      "Look at the ground outside the door.",
      "Find the paw prints.",
    ],
    parkNote: null,
  },
  {
    text: "Watch the first pitch get thrown at Casey's (10:30)",
    icon: "baseball",
    iconWord: "Pitch",
    steps: [
      "Go to Casey's Corner on Main Street.",
      "Watch for someone throwing a first pitch.",
      "Stay together so everyone can see.",
    ],
    parkNote: "The card says 10:30. The park can change that time. Ask on the day you go.",
  },
  {
    text: "Watch the flag retreat at 5:30",
    icon: "flag",
    iconWord: "Flag",
    steps: [
      "Go to the flag near the front of Main Street.",
      "Watch the flag come down.",
      "You can stand or sit. There is no rush in this app.",
    ],
    parkNote: "The card says 5:30. The park can change that time. Ask on the day you go.",
  },
  {
    text: "Find the peanuts in the asphalt",
    icon: "peanut",
    iconWord: "Peanuts",
    steps: [
      "Look down at the pavement. Asphalt is the hard ground.",
      "Search for shapes like peanuts.",
      "Families often look near Casey's Corner and in Storybook Circus.",
      "If you cannot find them, ask a cast member.",
    ],
    parkNote: null,
  },
  {
    text: "Apply to be a Whiff-sistant at storybook treats",
    icon: "sniff",
    iconWord: "Sniff",
    steps: [
      "Go to the snack stand the card calls storybook treats. It is in Storybook Circus.",
      "A Whiff-sistant is a silly helper name. It means someone who sniffs.",
      "Ask how to apply. Do the playful sign-up if they still have it.",
    ],
    parkNote: "The sign and the treats can change. If the sign moved, ask a cast member where it is now.",
  },
  {
    text: "Go to a restaurant with antler decorations",
    icon: "antlers",
    iconWord: "Antlers",
    steps: [
      "The card does not name the restaurant.",
      "Walk until you see a place to eat with antlers on the wall.",
      "Go inside together. Your family can decide if you sit down or just visit.",
    ],
    parkNote: null,
  },
  {
    text: "See the characters ride Dumbo at 9:30",
    icon: "elephant",
    iconWord: "Dumbo",
    steps: [
      "Go to Dumbo the Flying Elephant.",
      "Watch for characters riding Dumbo.",
      "Look only. Wait behind any ropes.",
    ],
    parkNote: "The card says 9:30. This may not happen every day. Ask on the day you go.",
  },
  {
    text: "Find 3 hidden Pascals outside of the Tangled bathrooms",
    icon: "lizard",
    iconWord: "Pascal",
    steps: [
      "Go to the Tangled bathrooms in Fantasyland.",
      "Look outside for small Pascal figures. Pascal is a little chameleon.",
      "Find 3 of them before you stamp this.",
    ],
    parkNote: null,
  },
  {
    text: "Ask a Cast member the name of their bat (HM)",
    icon: "bat",
    iconWord: "Bat",
    steps: [
      "HM means Haunted Mansion. Go there.",
      "A Cast member is a park worker.",
      "Ask the name of their bat. There is not one right answer.",
      "Be kind. If they are busy, wait.",
    ],
    parkNote: null,
  },
  {
    text: "Check for a hidden Mickey on the table in the ballroom (HM)",
    icon: "search",
    iconWord: "Search",
    steps: [
      "HM means Haunted Mansion. Ride it.",
      "In the ballroom scene, look at the table.",
      "A hidden Mickey is a round shape with two round ears.",
      "Look only. Do not touch the ride. You may need to ride again.",
    ],
    parkNote: null,
  },
  {
    text: "Avoid the poop river! (LS)",
    icon: "river",
    iconWord: "River",
    steps: [
      "LS means Liberty Square. Go there.",
      "Find the messy brown river spot.",
      "Walk around it. Do not step in it.",
      "If you are not sure, ask a cast member.",
    ],
    parkNote: null,
  },
  {
    text: "Ask the stepsisters who Lucifer's favorite is",
    icon: "question",
    iconWord: "Ask",
    steps: [
      "Find Cinderella's stepsisters.",
      "Lucifer is the cat in the story.",
      "Ask them who Lucifer's favorite is.",
      "You might see them in person or in the castle. Enjoy their answer.",
    ],
    parkNote: "Meeting spots change. Ask at the park where the stepsisters are today.",
  },
  {
    text: "Get pixie dusted at Sir Mickey's",
    icon: "spark",
    iconWord: "Pixie dust",
    steps: [
      "Go to the shop called Sir Mickey's in Fantasyland.",
      "Ask a cast member if you can be pixie dusted.",
      "They may share paper pixie dust. Be gentle with it.",
    ],
    parkNote: "If they do not have pixie dust today, leave this unstamped and try again later.",
  },
  {
    text: "Kneel at the Cinderella fountain and watch the crown",
    icon: "fountain",
    iconWord: "Fountain",
    steps: [
      "Find the Cinderella fountain near the castle.",
      "Kneel if your body can do that.",
      "If kneeling is hard, sit or stand close. That still counts.",
      "Watch the crown.",
    ],
    parkNote: null,
  },
  {
    text: "Ask Mickey if he did his holiday shopping",
    icon: "bag",
    iconWord: "Mickey",
    steps: [
      "Find Mickey at a greeting.",
      "Ask if he did his holiday shopping.",
      "Any answer counts. Be kind and wait your turn.",
    ],
    parkNote: "Mickey's greeting spot changes. Ask at the park today. If you cannot meet him, leave this unstamped.",
  },
  {
    text: "Write a letter to Santa (Ye Olde Christmas Shoppe)",
    icon: "letter",
    iconWord: "Letter",
    steps: [
      "Go to Ye Olde Christmas Shoppe in Liberty Square.",
      "Write a few words to Santa.",
      "Use their paper if they have it, or your own.",
    ],
    parkNote: null,
  },
  {
    text: "Knock on the painting at Momento Mori",
    icon: "door",
    iconWord: "Knock",
    steps: [
      "Go to the shop in Liberty Square.",
      "The card spells it Momento Mori. Use that name when you ask.",
      "Find a painting and knock gently.",
      "Listen. Be gentle with the art.",
    ],
    parkNote: null,
  },
  {
    text: "Get spit on by a camel in Adventureland",
    icon: "camel",
    iconWord: "Camel",
    steps: [
      "Go to Adventureland, by the Magic Carpets of Aladdin.",
      "A camel statue can spit water.",
      "Get splashed only if you want to get wet.",
      "Someone else in the family can take the splash for the team.",
    ],
    parkNote: null,
  },
  {
    text: "Check out the mosiac in Cinderella castle",
    icon: "tiles",
    iconWord: "Tiles",
    steps: [
      "Walk through the arch of Cinderella Castle.",
      "Look at the picture made of many tiny tiles.",
      "The card spells it mosiac. That means this tile picture.",
    ],
    parkNote: null,
  },
  {
    text: "Ride Mine Train during Fireworks",
    icon: "cart",
    iconWord: "Mine train",
    steps: [
      "Ride Seven Dwarfs Mine Train. The card says Mine Train.",
      "Ride it while fireworks are in the sky.",
      "There is no clock in this app. Come back when the sky show starts.",
    ],
    parkNote: "Fireworks are not every night. Check the park. You may wait in line. Ask a cast member how to ride it today.",
  },
  {
    text: "Enjoy a dole whip on the people mover",
    icon: "cup",
    iconWord: "Snack",
    steps: [
      "A dole whip is a cold pineapple snack. The card writes it in lowercase.",
      "The people mover is the slow ride in Tomorrowland.",
      "Enjoy the snack while you ride, if your family wants to buy one.",
    ],
    parkNote: "This snack costs money. Your family can skip a challenge that costs money. The snack and the ride can close. Check the park.",
  },
  {
    text: "Become a galactic hero on Buzz Lightyear",
    icon: "badge",
    iconWord: "Hero",
    steps: [
      "Ride Buzz Lightyear's Space Ranger Spin.",
      "Aim at the targets and play the game.",
      "Any score counts. Your family is a galactic hero together.",
    ],
    parkNote: null,
  },
];

export function challengeAt(index: number): Challenge {
  const challenge = CHALLENGES[index];
  if (!challenge) {
    throw new Error("Challenge index is out of range.");
  }
  return challenge;
}
