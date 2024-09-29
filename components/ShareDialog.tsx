import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share, Copy, Check } from 'lucide-react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, LinkedinShareButton, EmailShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, WhatsappIcon, LinkedinIcon, EmailIcon } from 'react-share';

interface ShareDialogProps {
  url: string;
  title: string;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ url, title }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          <Share className="mr-2 h-4 w-4" /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this listing</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <Input
            readOnly
            value={url}
            className="flex-1"
          />
          <Button size="sm" className="px-3" onClick={handleCopyLink}>
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex justify-center space-x-2 mt-4">
          <FacebookShareButton url={url} title={title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={url} title={title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton url={url} title={title}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <LinkedinShareButton url={url} title={title}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
          <EmailShareButton url={url} subject={title}>
            <EmailIcon size={32} round />
          </EmailShareButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;