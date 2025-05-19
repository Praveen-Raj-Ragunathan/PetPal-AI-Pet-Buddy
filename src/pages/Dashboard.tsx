import React, { useState, useEffect } from "react";
import PetList from "@/components/PetList";
import ChatPanel from "@/components/ChatPanel";
import { useToast } from "@/hooks/use-toast";

export type Pet = {
  id: string;
  name: string;
  type: "dog" | "cat" | "bird" | "rabbit" | "fish";
  traits: string[];
  avatar: string;
  breed?: string; // Added optional breed property
};

export type Message = {
  id: string;
  content: string;
  sender: "user" | "pet";
  petId: string;
  timestamp: Date;
  action?: {
    actionType: string;
    targetPetId?: string;
    details?: string;
  };
  stickerUrl?: string; // Added optional stickerUrl property
};

const Dashboard = () => {
  const [pets, setPets] = useState<Pet[]>([
    {
      id: "rex_dog",
      name: "Rex",
      type: "dog",
      traits: ["playful", "loyal", "energetic"],
      avatar: "🐕",
      breed: "Golden Retriever", // Added breed to initial pets
    },
    {
      id: "whiskers_cat",
      name: "Whiskers",
      type: "cat",
      traits: ["curious", "independent", "affectionate"],
      avatar: "🐈",
      breed: "Siamese", // Added breed to initial pets
    },
  ]);

  const [selectedPet, setSelectedPet] = useState<Pet | null>(pets[0]);
  const [messages, setMessages] = useState<Message[]>(
    // Initial sample conversation
    [
      {
        id: "welcome",
        content: "Woof! I'm so happy to see you! What should we do today? 🐾",
        sender: "pet",
        petId: "rex_dog",
        timestamp: new Date(Date.now() - 30000), // Timestamp in the past
      },
      {
        id: "user-sample-1",
        content: "Hey Rex! Want to play fetch?",
        sender: "user",
        petId: "rex_dog",
        timestamp: new Date(Date.now() - 20000), // Timestamp in the past
      },
      {
        id: "pet-sample-1",
        content: "BALL?! THROW IT! THROW IT! I'LL CATCH IT! *bounces excitedly* 🎾",
        sender: "pet",
        petId: "rex_dog",
        timestamp: new Date(Date.now() - 10000), // Timestamp in the past
        stickerUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3be.svg", // Tennis ball sticker
      },
       {
        id: "user-sample-2",
        content: "Haha, okay! You're so energetic!",
        sender: "user",
        petId: "rex_dog",
        timestamp: new Date(Date.now() - 5000), // Timestamp in the past
      },
       {
        id: "pet-sample-2",
        content: "Woof! I'm just happy you're talking to me! *tail wagging* 🐶",
        sender: "pet",
        petId: "rex_dog",
        timestamp: new Date(), // Current timestamp
        stickerUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f436.svg", // Dog face sticker
      },
    ]
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreatePet = (newPet: Omit<Pet, "id">) => {
    const id = `${newPet.name.toLowerCase().replace(/\s+/g, '_')}_${newPet.type}${newPet.breed ? `_${newPet.breed.toLowerCase().replace(/\s+/g, '_')}` : ''}`; // Include breed in ID if available
    const pet = { ...newPet, id };
    setPets([...pets, pet]);
    setSelectedPet(pet);

    // Add a welcome message from the newly created pet
    const welcomeMessage: Message = {
      id: `welcome_${Date.now()}`,
      content: getPetWelcomeMessage(pet),
      sender: "pet",
      petId: pet.id,
      timestamp: new Date(),
    };
    setMessages([...messages, welcomeMessage]);
  };

  const handleSelectPet = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    if (pet) {
      setSelectedPet(pet);

      // Check if there are any messages for this pet
      const petMessages = messages.filter(m => m.petId === pet.id);

      // If no messages, add a welcome message
      if (petMessages.length === 0) {
        const welcomeMessage: Message = {
          id: `welcome_${Date.now()}`,
          content: getPetWelcomeMessage(pet),
          sender: "pet",
          petId: pet.id,
          timestamp: new Date(),
        };
        setMessages([...messages, welcomeMessage]);
      }
    }
  };

  // Function to handle updating a pet's details
  const handleUpdatePet = (updatedPet: Pet) => {
    setPets(pets.map(pet =>
      pet.id === updatedPet.id ? updatedPet : pet
    ));
    // If the currently selected pet is updated, update the selectedPet state as well
    if (selectedPet && selectedPet.id === updatedPet.id) {
      setSelectedPet(updatedPet);
    }
    toast({
      title: "Pet Updated",
      description: `${updatedPet.name}'s details have been updated.`,
    });
  };

  // Function to handle deleting a pet
  const handleDeletePet = (petId: string) => {
    setPets(pets.filter(pet => pet.id !== petId));
    // If the deleted pet was the selected one, clear the selection
    if (selectedPet && selectedPet.id === petId) {
      setSelectedPet(null);
    }
    // Also remove messages associated with the deleted pet
    setMessages(messages.filter(message => message.petId !== petId));

    toast({
      title: "Pet Deleted",
      description: "Your pet has been removed.",
    });
  };


  const getPetWelcomeMessage = (pet: Pet): string => {
    switch (pet.type) {
      case "dog":
        return `Woof! I'm so excited to see you! Let's play! 🐾`;
      case "cat":
        return `Meow~ Hello there. I might let you pet me if you're lucky. 😺`;
      case "bird":
        return `*Chirp chirp* Hello! Want to hear a song? 🐦`;
      case "rabbit":
        return `*Twitches nose* Hi there! Got any carrots? 🐰`;
      case "fish":
        return `*Blub blub* Welcome to my underwater world! 🐠`;
      default:
        return `Hello! I'm so happy to see you!`;
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedPet) return;

    // Add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content,
      sender: "user",
      petId: selectedPet.id,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate calling a backend endpoint for the pet response
      const response = await simulateBackendResponse(selectedPet, content);

      const petResponse: Message = {
        id: `pet_${Date.now()}`,
        content: response.content,
        sender: "pet",
        petId: selectedPet.id,
        timestamp: new Date(),
        action: response.action,
        stickerUrl: response.stickerUrl, // Include stickerUrl in the message
      };

      setMessages(prev => [...prev, petResponse]);
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Failed to generate pet response. Our pets are taking a nap right now.",
        variant: "destructive",
      });

      // Fallback to simulated response
      const fallbackResponse: Message = {
        id: `pet_${Date.now()}`,
        content: simulatePetResponse(selectedPet, content),
        sender: "pet",
        petId: selectedPet.id,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Define a collection of sticker URLs (replace with actual URLs)
  const STICKERS: { [key in Pet['type']]?: string[] } = {
    dog: [
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f436.svg", // Dog face
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f415.svg", // Dog
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f971.svg", // Yawning face (sleepy dog)
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3be.svg", // Tennis Racquet and Ball (playful)
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4a6.svg", // Splashing sweat symbol (energetic)
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f917.svg", // Hugging face (affectionate/loyal)
    ],
    cat: [
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f431.svg", // Cat face
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f63a.svg", // Smiling cat face with open mouth
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f63b.svg", // Smiling cat face with heart-eyes
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f408.svg", // Cat
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4a4.svg", // Zzz (sleeping)
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f640.svg", // Face with open mouth vomiting (hairball/disgusted)
    ],
    bird: [
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f426.svg", // Bird
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f425.svg", // Hatching chick
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg", // Musical note (singing)
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4e2.svg", // Loudspeaker (talkative)
    ],
    rabbit: [
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f407.svg", // Rabbit
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f430.svg", // Rabbit face
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f955.svg", // Carrot
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f440.svg", // Eyes (curious)
    ],
    fish: [
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f41f.svg", // Fish
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f420.svg", // Tropical fish
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f9bd.svg", // Diving mask (underwater)
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4a7.svg", // Droplet (water)
    ],
  };


  // This function simulates a backend call to a model like OpenChat 3.5
  // In a real implementation, this would be a fetch call to your backend API
  const simulateBackendResponse = async (pet: Pet, userMessage: string) => {
    console.log(`Simulating backend call for ${pet.name} (${pet.breed || pet.type}, Traits: ${pet.traits.join(', ')}) with message: "${userMessage}"`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerMessage = userMessage.toLowerCase();
    let simulatedContent = "";
    let stickerUrl: string | undefined;

    // --- Enhanced Response Logic with Sticker Triggers ---

    // Determine base response and potential sticker based on keywords, type, breed, and traits
    if (pet.type === "dog") {
      if (lowerMessage.includes("walk") || lowerMessage.includes("outside")) {
        simulatedContent = "WALK?! YES YES YES!! I LOVE WALKS! 🐕🦮🐾";
        stickerUrl = STICKERS.dog?.[0]; // Dog face for excitement
      } else if (lowerMessage.includes("treat") || lowerMessage.includes("food")) {
        simulatedContent = "Treats?! *wags tail frantically* Yes please! 🦴";
        stickerUrl = STICKERS.dog?.[1]; // Dog for treat
      } else if (lowerMessage.includes("play") || lowerMessage.includes("ball")) {
        simulatedContent = "BALL?! THROW IT! THROW IT! I'LL CATCH IT! *bounces excitedly* 🎾";
         stickerUrl = STICKERS.dog?.[3]; // Tennis ball for play
      } else if (lowerMessage.includes("good") || lowerMessage.includes("pet")) {
        simulatedContent = "*tail wagging intensifies* I love you too! You're my favorite human! 💕";
         stickerUrl = STICKERS.dog?.[5]; // Hugging face for affection
      } else if (pet.traits.includes("energetic") && Math.random() > 0.5) { // Energetic trait trigger
         simulatedContent = "I'm bursting with energy! Let's run!";
         stickerUrl = STICKERS.dog?.[4]; // Splashing sweat for energy
      } else if (pet.traits.includes("loyal") && Math.random() > 0.5) { // Loyal trait trigger
         simulatedContent = "Always by your side! *leans on you*";
         stickerUrl = STICKERS.dog?.[5]; // Hugging face for loyalty
      }
    } else if (pet.type === "cat") {
       if (lowerMessage.includes("food") || lowerMessage.includes("treat")) {
        simulatedContent = "Meow... I suppose I could eat something. If it's premium quality. 😼";
         stickerUrl = STICKERS.cat?.[0]; // Cat face for food
      } else if (lowerMessage.includes("pet") || lowerMessage.includes("scratch")) {
        simulatedContent = "*purrs softly* Right behind the ears, please... 😺";
         stickerUrl = STICKERS.cat?.[1]; // Smiling cat for pets
      } else if (lowerMessage.includes("toy") || lowerMessage.includes("play")) {
        simulatedContent = "*eyes dilate* Is that a toy? *crouches, ready to pounce* 🐱";
      } else if (lowerMessage.includes("love") || lowerMessage.includes("good")) {
        simulatedContent = "*slow blink* I tolerate you more than most humans. That's high praise. 💤";
      } else if (pet.traits.includes("curious") && Math.random() > 0.5) { // Curious trait trigger
         simulatedContent = "What's over there? *peeks around corner*";
      } else if (pet.traits.includes("independent") && Math.random() > 0.5) { // Independent trait trigger
         simulatedContent = "I'll just be over here... doing my own thing.";
      }
    } else if (pet.type === "bird") {
       if (lowerMessage.includes("sing") || lowerMessage.includes("song")) {
        simulatedContent = "*chirps melodically* 🎵 Tweet-tweet-TWEEEET! 🎵 *head bobs* 🐦";
         stickerUrl = STICKERS.bird?.[2]; // Musical note for singing
      } else if (lowerMessage.includes("food") || lowerMessage.includes("seed")) {
        simulatedContent = "*flutters wings* Seeds! My favorite! *hops excitedly* 🌱";
         stickerUrl = STICKERS.bird?.[0]; // Bird for food
      } else if (pet.traits.includes("talkative") && Math.random() > 0.5) { // Talkative trait trigger
         simulatedContent = "Chirp chirp chirp! I have so much to tell you!";
         stickerUrl = STICKERS.bird?.[3]; // Loudspeaker for talkative
      }
    } else if (pet.type === "rabbit") {
       if (lowerMessage.includes("carrot") || lowerMessage.includes("food")) {
        simulatedContent = "*nose twitches rapidly* Carrots?! *thumps foot excitedly* 🥕";
         stickerUrl = STICKERS.rabbit?.[2]; // Carrot for food
      } else if (lowerMessage.includes("pet") || lowerMessage.includes("soft")) {
        simulatedContent = "*closes eyes contentedly* *soft purring sound* 🐰";
         stickerUrl = STICKERS.rabbit?.[1]; // Rabbit face for pets
      } else if (pet.traits.includes("shy") && Math.random() > 0.5) { // Shy trait trigger
         simulatedContent = "*hides behind you* A little scared...";
      }
    } else if (pet.type === "fish") {
       if (lowerMessage.includes("food") || lowerMessage.includes("feed")) {
        simulatedContent = "*swims to surface excitedly* Blub blub! *mouth opens and closes* 🐠";
         stickerUrl = STICKERS.fish?.[0]; // Fish for food
      } else if (lowerMessage.includes("tank") || lowerMessage.includes("water")) {
        simulatedContent = "*swims in a circle* Blub! *bubbles rise* My underwater palace! 💧";
         stickerUrl = STICKERS.fish?.[2]; // Diving mask for tank
      } else if (pet.traits.includes("calm") && Math.random() > 0.5) { // Calm trait trigger
         simulatedContent = "Just peacefully swimming... Ahh.";
      }
    }

    // 4. If no specific trigger, use a general response, potentially adding a random sticker
    if (simulatedContent === "") {
      // Add a chance to include a random sticker even with a general response
      if (Math.random() > 0.5 && STICKERS[pet.type]) { // 50% chance for a random sticker
          stickerUrl = STICKERS[pet.type]?.[Math.floor(Math.random() * STICKERS[pet.type]!.length)];
      }

      // Generate a general response, potentially mentioning breed or traits
      let generalResponse = "";
      const breedMention = pet.breed && Math.random() > 0.6 ? ` As a ${pet.breed},` : ''; // 40% chance to mention breed
      const traitMention = pet.traits.length > 0 && Math.random() > 0.6 ? ` I'm feeling ${pet.traits[Math.floor(Math.random() * pet.traits.length)]}!` : ''; // 40% chance to mention a random trait

      switch (pet.type) {
        case "dog":
           generalResponse = dogResponses[Math.floor(Math.random() * dogResponses.length)];
           break;
        case "cat":
           generalResponse = catResponses[Math.floor(Math.random() * catResponses.length)];
           break;
        case "bird":
           generalResponse = birdResponses[Math.floor(Math.random() * birdResponses.length)];
           break;
        case "rabbit":
           generalResponse = rabbitResponses[Math.floor(Math.random() * rabbitResponses.length)];
           break;
        case "fish":
           generalResponse = fishResponses[Math.floor(Math.random() * fishResponses.length)];
           break;
        default:
           generalResponse = "I'm happy to chat!";
           break;
      }
       simulatedContent = `${generalResponse}${breedMention}${traitMention}`;
    }


    return {
      content: simulatedContent,
      action: {
        actionType: "message_pet",
        targetPetId: pet.id,
        details: `Simulated AI response to: ${userMessage}`
      },
      stickerUrl: stickerUrl, // Include the selected sticker URL
    };
  };

  // Kept the simulatePetResponse as a fallback (though simulateBackendResponse is now the primary)
  const simulatePetResponse = (pet: Pet, userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (pet.type === "dog") {
      if (lowerMessage.includes("walk") || lowerMessage.includes("outside")) {
        return "WALK?! YES YES YES!! I LOVE WALKS! 🐕🦮🐾";
      } else if (lowerMessage.includes("treat") || lowerMessage.includes("food")) {
        return "Treats?! *wags tail frantically* Yes please! I've been a good boy! 🦴";
      } else if (lowerMessage.includes("play") || lowerMessage.includes("ball")) {
        return "BALL?! THROW IT! THROW IT! I'LL CATCH IT! *bounces excitedly* 🎾";
      } else if (lowerMessage.includes("good") || lowerMessage.includes("pet")) {
        return "*tail wagging intensifies* I love you too! You're my favorite human! 💕";
      } else {
        return "Woof! I'm just happy you're talking to me! *tail wagging* 🐶";
      }
    } else if (pet.type === "cat") {
      if (lowerMessage.includes("food") || lowerMessage.includes("treat")) {
        return "Meow... I suppose I could eat something. If it's premium quality. 😼";
      } else if (lowerMessage.includes("pet") || lowerMessage.includes("scratch")) {
        return "*purrs softly* Right behind the ears, please... 😺";
      } else if (lowerMessage.includes("toy") || lowerMessage.includes("play")) {
        return "*eyes dilate* Is that a toy? *crouches, ready to pounce* 🐱";
      } else if (lowerMessage.includes("love") || lowerMessage.includes("good")) {
        return "*slow blink* I tolerate you more than most humans. That's high praise. 💤";
      } else {
        return "*stares at you judgmentally while purring* Meow. 🐱";
      }
    } else if (pet.type === "bird") {
      if (lowerMessage.includes("sing") || lowerMessage.includes("song")) {
        return "*chirps melodically* 🎵 Tweet-tweet-TWEEEET! 🎵 *head bobs* 🐦";
      } else if (lowerMessage.includes("food") || lowerMessage.includes("seed")) {
        return "*flutters wings* Seeds! My favorite! *hops excitedly* 🌱";
      } else {
        return "*tilts head curiously* Chirp? *fluffs feathers* 🐦";
      }
    } else if (pet.type === "rabbit") {
      if (lowerMessage.includes("carrot") || lowerMessage.includes("food")) {
        return "*nose twitches rapidly* Carrots?! *thumps foot excitedly* 🥕";
      } else if (lowerMessage.includes("pet") || lowerMessage.includes("soft")) {
        return "*closes eyes contentedly* *soft purring sound* 🐰";
      } else {
        return "*curious hop* *sniffs the air* *wiggles ears* 🐇";
      }
    } else if (pet.type === "fish") {
      if (lowerMessage.includes("food") || lowerMessage.includes("feed")) {
        return "*swims to surface excitedly* Blub blub! *mouth opens and closes* 🐠";
      } else if (lowerMessage.includes("tank") || lowerMessage.includes("water")) {
        return "*swims in a circle* Blub! *bubbles rise* My underwater palace! 💧";
      } else {
        return "*gentle swimming* *bubbles* *fin wiggle* 🐟";
      }
    }

    return "I'm so happy to be chatting with you! 💖";
  };


  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <h1 className="text-2xl font-bold">PetPal 🐾</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <PetList
          pets={pets}
          selectedPet={selectedPet}
          onSelectPet={handleSelectPet}
          onCreatePet={handleCreatePet}
          onUpdatePet={handleUpdatePet}
          onDeletePet={handleDeletePet} // Pass the delete function
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <ChatPanel
            messages={messages.filter(m => !selectedPet || m.petId === selectedPet.id)}
            selectedPet={selectedPet}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;