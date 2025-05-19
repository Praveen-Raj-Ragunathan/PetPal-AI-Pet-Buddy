import React, { useState } from "react";
import { Plus, HelpCircle, Edit, Trash2 } from "lucide-react"; // Import Edit and Trash2 icons
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"; // Import AlertDialog components
import { Pet } from "@/pages/Dashboard"; // Import Pet type

type PetListProps = {
  pets: Pet[];
  selectedPet: Pet | null;
  onSelectPet: (petId: string) => void;
  onCreatePet: (pet: Omit<Pet, "id">) => void;
  onUpdatePet: (pet: Pet) => void;
  onDeletePet: (petId: string) => void; // Add onDeletePet prop
};

// Define default traits
const DEFAULT_TRAITS = [
  "playful",
  "loyal",
  "energetic",
  "curious",
  "independent",
  "affectionate",
  "shy",
  "brave",
  "calm",
  "talkative",
];

// Define breeds for each pet type
const BREEDS: { [key in Pet['type']]: string[] } = {
  dog: ["Golden Retriever", "Labrador Retriever", "German Shepherd", "Poodle", "Bulldog", "Beagle", "Pug", "Dachshund"],
  cat: ["Siamese", "Persian", "Maine Coon", "Ragdoll", "Sphynx", "British Shorthair", "Abyssinian", "Bengal"],
  bird: ["Parakeet", "Cockatiel", "Cockatoo", "African Grey Parrot", "Macaw", "Finch", "Canary"],
  rabbit: ["Holland Lop", "Mini Rex", "Netherland Dwarf", "Lionhead", "Flemish Giant"],
  fish: ["Goldfish", "Betta", "Guppy", "Neon Tetra", "Angelfish", "Clownfish"],
};


const PetList = ({ pets, selectedPet, onSelectPet, onCreatePet, onUpdatePet, onDeletePet }: PetListProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for delete dialog
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null); // State for the pet to be deleted
  const [newPet, setNewPet] = useState<Omit<Pet, "id">>({
    name: "",
    type: "dog",
    traits: [],
    avatar: "🐕",
    breed: "",
  });
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPet({ ...newPet, [e.target.id]: e.target.value });
  };

  const handleCreatePet = () => {
    if (newPet.name.trim()) {
      onCreatePet(newPet);
      setNewPet({
        name: "",
        type: "dog",
        traits: [],
        avatar: "🐕",
        breed: "",
      });
      setIsCreateDialogOpen(false);
    }
  };

  const handleTypeChange = (type: Pet['type']) => {
    let avatar = "🐕";
    switch (type) {
      case "cat": avatar = "🐈"; break;
      case "bird": avatar = "🐦"; break;
      case "rabbit": avatar = "🐰"; break;
      case "fish": avatar = "🐠"; break;
    }
    setNewPet({ ...newPet, type, avatar, breed: "" });
  };

  const handleTraitCheckboxChange = (trait: string, isChecked: boolean) => {
    if (isChecked) {
      setNewPet({ ...newPet, traits: [...newPet.traits, trait] });
    } else {
      setNewPet({ ...newPet, traits: newPet.traits.filter(t => t !== trait) });
    }
  };

  const handleBreedChange = (breed: string) => {
    setNewPet({ ...newPet, breed });
  };

  const handleOpenEditDialog = (pet: Pet) => {
    setEditingPet(pet);
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingPet) {
      setEditingPet({ ...editingPet, [e.target.id]: e.target.value });
    }
  };

  const handleEditTypeChange = (type: Pet['type']) => {
     if (editingPet) {
        let avatar = "🐕";
        switch (type) {
          case "cat": avatar = "🐈"; break;
          case "bird": avatar = "🐦"; break;
          case "rabbit": avatar = "🐰"; break;
          case "fish": avatar = "🐠"; break;
        }
       setEditingPet({ ...editingPet, type, avatar, breed: "" });
     }
  };

  const handleEditBreedChange = (breed: string) => {
     if (editingPet) {
       setEditingPet({ ...editingPet, breed });
     }
  };

  const handleEditTraitCheckboxChange = (trait: string, isChecked: boolean) => {
    if (editingPet) {
      if (isChecked) {
        setEditingPet({ ...editingPet, traits: [...editingPet.traits, trait] });
      } else {
        setEditingPet({ ...editingPet, traits: editingPet.traits.filter(t => t !== trait) });
      }
    }
  };

  const handleSaveEdit = () => {
    if (editingPet && editingPet.name.trim()) {
      onUpdatePet(editingPet);
      setIsEditDialogOpen(false);
      setEditingPet(null);
    }
  };

  // Handle opening the delete confirmation dialog
  const handleOpenDeleteDialog = (pet: Pet) => {
    setPetToDelete(pet);
    setIsDeleteDialogOpen(true);
  };

  // Handle confirming the deletion
  const handleConfirmDelete = () => {
    if (petToDelete && onDeletePet) { // Added check if onDeletePet is a function
      onDeletePet(petToDelete.id); // Call the delete function from Dashboard
      setIsDeleteDialogOpen(false);
      setPetToDelete(null);
    }
  };


  return (
    <div className="w-64 bg-muted border-r border-border flex flex-col h-full">
      <div className="p-4 flex justify-between items-center border-b border-border">
        <h2 className="font-semibold">My Pets</h2>
        <div className="flex gap-2">
          <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>PetPal Help</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Chat with your pets</h3>
                  <p className="text-sm text-muted-foreground">Select a pet and start chatting! Your pets will respond with personality.</p>
                </div>
                <div>
                  <h3 className="font-medium">Create new pets</h3>
                  <p className="text-sm text-muted-foreground">Click the + button to add a new virtual pet with custom traits.</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Pet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Pet Name</Label>
                  <Input
                    id="name"
                    value={newPet.name}
                    onChange={handleCreateInputChange}
                    placeholder="Enter pet name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Pet Type</Label>
                  <Select
                    value={newPet.type}
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog 🐕</SelectItem>
                      <SelectItem value="cat">Cat 🐈</SelectItem>
                      <SelectItem value="bird">Bird 🐦</SelectItem>
                      <SelectItem value="rabbit">Rabbit 🐰</SelectItem>
                      <SelectItem value="fish">Fish 🐠</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Breed Selection Dropdown */}
                {newPet.type && BREEDS[newPet.type] && BREEDS[newPet.type].length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="breed">Pet Breed</Label>
                    <Select
                      value={newPet.breed}
                      onValueChange={handleBreedChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${newPet.type} breed`} />
                      </SelectTrigger>
                      <SelectContent>
                        {BREEDS[newPet.type].map(breed => (
                          <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}


                {/* Trait Selection with Checkboxes */}
                <div className="space-y-2">
                  <Label>Select Traits (up to 3 recommended)</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {DEFAULT_TRAITS.map(trait => (
                      <div key={trait} className="flex items-center space-x-2">
                        <Checkbox
                          id={`trait-${trait}`}
                          checked={newPet.traits.includes(trait)}
                          onCheckedChange={(isChecked: boolean) => handleTraitCheckboxChange(trait, isChecked)}
                        />
                        <Label htmlFor={`trait-${trait}`} className="capitalize font-normal">
                          {trait}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleCreatePet} className="w-full">
                  Create Pet
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className={`w-full p-3 flex items-center justify-between rounded-md transition-all cursor-pointer ${
                selectedPet?.id === pet.id
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted-foreground/10"
              }`}
              onClick={() => onSelectPet(pet.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-label={pet.type}>
                  {pet.avatar}
                </span>
                <div className="text-left">
                  <div className="font-medium">{pet.name}</div>
                  <div className="text-xs text-muted-foreground flex gap-1 flex-wrap">
                     {pet.breed && <span className="capitalize">{pet.breed} • </span>}
                    {pet.traits.map((trait, i) => (
                      <span key={i} className="capitalize">
                        {i > 0 ? "• " : ""}{trait}
                      </span>
                    ))}
                     {pet.traits.length === 0 && !pet.breed && <span>No traits selected</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleOpenEditDialog(pet); }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80" onClick={(e) => { e.stopPropagation(); handleOpenDeleteDialog(pet); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Edit Pet Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingPet?.name}</DialogTitle>
          </DialogHeader>
          {editingPet && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Pet Name</Label>
                <Input
                  id="name"
                  value={editingPet.name}
                  onChange={handleEditInputChange}
                  placeholder="Enter pet name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Pet Type</Label>
                 <Input id="type" value={editingPet.type} disabled className="capitalize" />
              </div>

              {editingPet.type && BREEDS[editingPet.type] && BREEDS[editingPet.type].length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="breed">Pet Breed</Label>
                  <Select
                    value={editingPet.breed}
                    onValueChange={handleEditBreedChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${editingPet.type} breed`} />
                    </SelectTrigger>
                    <SelectContent>
                      {BREEDS[editingPet.type].map(breed => (
                        <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Select Traits (up to 3 recommended)</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {DEFAULT_TRAITS.map(trait => (
                    <div key={trait} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-trait-${trait}`}
                        checked={editingPet.traits.includes(trait)}
                        onCheckedChange={(isChecked: boolean) => handleEditTraitCheckboxChange(trait, isChecked)}
                      />
                      <Label htmlFor={`edit-trait-${trait}`} className="capitalize font-normal">
                        {trait}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Pet Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {petToDelete?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PetList;