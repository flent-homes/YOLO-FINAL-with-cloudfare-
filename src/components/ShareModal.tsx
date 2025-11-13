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
  const url = "https://shorturl.at/Z4XA7";
  
  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.error("navigator.clipboard.writeText failed", error);
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      console.error("document.execCommand('copy') failed", error);
      copied = false;
    }

    document.body.removeChild(textarea);
    return copied;
  };

  const displayName = fullName?.trim() || "your name";
  const displayPhone = phone?.trim() || "your number";

  const messages = {
    whatsapp: `Hey, check out Flent: ${url}\n\nThey offer tastefully furnished rental homes in the most sought after neighbourhoods of Bangalore. You can rent a room or the entire house, totally up to you :)\n\nIf you end up booking, please mention my name (${displayName}) and my number (${displayPhone}) in the onboarding form.`,

    instagram: `Hey, check out Flent: ${url}\n\nThey offer tastefully furnished rental homes in the most sought after neighbourhoods of Bangalore. You can rent a room or the entire house, totally up to you :)\n\nIf you end up booking, please mention my name (${displayName}) and my number (${displayPhone}) in the onboarding form.`,

    generic: `Hey, check out Flent: ${url}\n\nThey offer tastefully furnished rental homes in the most sought after neighbourhoods of Bangalore. You can rent a room or the entire house, totally up to you :)\n\nIf you end up booking, please mention my name (${displayName}) and my number (${displayPhone}) in the onboarding form.`,
  };

  const copyGenericLink = async () => {
    const copied = await copyToClipboard(url);
    if (copied) {
      toast({
        description: "Link copied to clipboard!",
      });
    } else {
      toast({
        description: "Could not copy. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const copyInstagramMessage = async () => {
    const instagramUrl = `https://www.instagram.com/direct/new/?text=${encodeURIComponent(
      messages.instagram
    )}`;

    const copied = await copyToClipboard(messages.instagram);

    if (!copied) {
      toast({
        description: "Could not copy automatically — the message will be pasted in a new window.",
      });
    } else {
      toast({
        description: "Message copied! Opening Instagram…",
      });
    }

    window.open(instagramUrl, "_blank");
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
            WhatsApp
          </button>
          
          <button
            onClick={copyInstagramMessage}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-sans font-semibold hover:opacity-90 transition-opacity"
          >
            Instagram
          </button>
          
          <button
            onClick={shareToLinkedIn}
            className="w-full px-6 py-3 bg-[#0077B5] text-white rounded-lg font-sans font-semibold hover:opacity-90 transition-opacity"
          >
            LinkedIn
          </button>
          
          <button
            onClick={shareToMessenger}
            className="w-full px-6 py-3 bg-[#0084FF] text-white rounded-lg font-sans font-semibold hover:opacity-90 transition-opacity"
          >
            Messenger
          </button>
          
          <button
            onClick={copyGenericLink}
            className="w-full px-6 py-3 bg-secondary text-dark-text border border-border rounded-lg font-sans font-semibold hover:bg-dark-text/5 transition-colors"
          >
            Copy Link
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
