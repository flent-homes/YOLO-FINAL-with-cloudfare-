import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fullName: string;
  phone: string;
}

export const ShareModal = ({ isOpen, onClose, fullName, phone }: ShareModalProps) => {
  const { toast } = useToast();
  const url = "https://www.flent.in/?utm_source=YOLO%20Site&utm_medium=website&utm_campaign=YOLO";
  
  const messages = {
    whatsapp: `Hey, saw this rental housing platform called Flent that offers fully furnished ready-to-move homes. If you're looking to move, check out their website: ${url}\nAlso, if you end up booking, add my name (${fullName}) and number (${phone}) in their onboarding form!`,
    
    instagram: `Check out this rental housing platform for fully furnished homes in Bangalore, Flent Homes — looks good if you're planning to move soon.\n${url}\nAlso, if you end up booking, add my name (${fullName}) and number (${phone}) in their onboarding form!`,
    
    generic: `Check out Flent Homes, it's a rental housing platform that offers fully furnished ready-to-move-in homes in Bangalore:\n${url}\nAlso, if you end up booking, just write my name (${fullName}) and number (${phone}) in their onboarding form.`,
  };

  const copyGenericLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        description: "Link copied to clipboard!",
      });
    } catch {
      toast({
        description: "Could not copy. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const copyInstagramMessage = async () => {
    try {
      await navigator.clipboard.writeText(messages.instagram);
      toast({
        description: "Message copied! You can paste it in Instagram DM.",
      });
    } catch {
      toast({
        description: "Could not copy. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(messages.whatsapp)}`, "_blank");
  };

  const shareToMessenger = () => {
    // Using Web Share API fallback for Messenger since Facebook requires app_id
    if (navigator.share) {
      navigator.share({
        title: "YOLO by Flent",
        text: messages.generic,
        url: url,
      }).catch(() => {
        // Fallback to copying link
        copyGenericLink();
      });
    } else {
      // Fallback: copy link for manual sharing
      copyGenericLink();
    }
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-light-bg border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-dark-text font-display text-2xl">Share with Friends</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <button
            onClick={shareToWhatsApp}
            className="w-full px-6 py-3 bg-[#25D366] text-white rounded-lg font-sans font-semibold hover:opacity-90 transition-opacity"
          >
            Share on WhatsApp
          </button>
          
          <button
            onClick={copyInstagramMessage}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-sans font-semibold hover:opacity-90 transition-opacity"
          >
            Copy for Instagram DM
          </button>
          
          <button
            onClick={shareToLinkedIn}
            className="w-full px-6 py-3 bg-[#0077B5] text-white rounded-lg font-sans font-semibold hover:opacity-90 transition-opacity"
          >
            Share on LinkedIn
          </button>
          
          <button
            onClick={shareToMessenger}
            className="w-full px-6 py-3 bg-[#0084FF] text-white rounded-lg font-sans font-semibold hover:opacity-90 transition-opacity"
          >
            Share on Messenger
          </button>
          
          <button
            onClick={copyGenericLink}
            className="w-full px-6 py-3 bg-secondary text-dark-text border border-border rounded-lg font-sans font-semibold hover:bg-dark-text/5 transition-colors"
          >
            Copy Link
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dark-text/60 hover:text-dark-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </DialogContent>
    </Dialog>
  );
};
