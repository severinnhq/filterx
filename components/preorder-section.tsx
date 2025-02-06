import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Download, Mail } from "lucide-react";
import { Smartphone, Monitor } from "lucide-react";
import Image from "next/image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function PreorderSection() {
  const [email, setEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.user && data.user.email) {
            setEmail(data.user.email);
          }
        } catch (error) {
          console.error("Error fetching user email:", error);
        }
      }
    };

    fetchUserEmail();
  }, []);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("/api/update-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (data.success) {
          toast({
            title: "Email Updated",
            description: "Your email has been successfully updated.",
          });
        } else {
          throw new Error(data.error || "Failed to update email");
        }
      } catch (error) {
        console.error("Error updating email:", error);
        toast({
          title: "Error",
          description: "Failed to update email. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    
    const addFileToZip = async (path: string, zipPath: string) => {
      try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to fetch ${path}`);
        const content = await response.blob();
        zip.file(zipPath, content);
      } catch (error) {
        console.error(`Error adding ${path}:`, error);
        throw error;
      }
    };
  
    try {
      // Add files from root
      await addFileToZip("/manifest.json", "manifest.json");
      await addFileToZip("/content.js", "content.js");
      await addFileToZip("/logo.png", "logo.png");
  
      // Add complete popup folder contents
      const popupFolder = zip.folder("popup");
      if (!popupFolder) throw new Error("Failed to create popup folder");
      
      // Original popup files
      await addFileToZip("/popup/index.html", "popup/index.html");
      await addFileToZip("/popup/PopupPage.tsx", "popup/PopupPage.tsx");
      await addFileToZip("/popup/index.tsx", "popup/index.tsx");
      
      // Additional required popup files
      await addFileToZip("/popup/index.js", "popup/index.js");
      await addFileToZip("/popup/index.js.map", "popup/index.js.map");
      await addFileToZip("/popup/tsconfig.json", "popup/tsconfig.json");
      await addFileToZip("/popup/utils.ts", "popup/utils.ts");
      await addFileToZip("/popup/index.css", "popup/index.css");
  
      // Add icons
      const iconsFolder = zip.folder("icons");
      if (!iconsFolder) throw new Error("Failed to create icons folder");
      await addFileToZip("/icons/icon16.png", "icons/icon16.png");
      await addFileToZip("/icons/icon48.png", "icons/icon48.png");
      await addFileToZip("/icons/icon128.png", "icons/icon128.png");
  
      // Generate and download the zip
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "filterx.zip");
  
      toast({
        title: "Download Complete",
        description: "FilterX extension files downloaded successfully.",
      });
  
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Could not download extension files. Please try again.",
        variant: "destructive",
      });
    }
  };

  const implementationSteps = [
    "Download and unzip the extension files 📥",
    "Open Chrome and go to chrome://extensions 🔍",
    "Enable 'Developer mode' in top right 🛠️",
    "Click 'Load unpacked' button 📁",
    "Select the unzipped extension folder 📂",
    "Verify FilterX appears in extensions list ✅",
    "Pin FilterX to Chrome toolbar 📌",
    "Refresh X/Twitter tabs to activate 🔄",
  ];

  return (
    <section className="py-24 bg-gray-50 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-5xl px-4">
        <div className="flex items-center justify-center mb-12">
          <h2 className="text-3xl font-bold font-geist flex items-center">
            Your
            <Image src="/logo.png" alt="FilterX Logo" width={40} height={40} className="ml-3 mr-1" />
            FilterX
          </h2>
        </div>
        <div className="grid md:grid-cols-[1fr,1fr] gap-8 items-start">
          <Card className="h-full flex flex-col border border-gray-200 shadow-sm">
            <CardHeader className="px-6">
              <CardTitle className="font-geist">Implementation Steps</CardTitle>
              <CardDescription>Follow these steps to install the FilterX extension</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto px-8 relative">
              <ol className="relative border-l-2 border-gray-300 dark:border-gray-700 text-sm pl-0">
                {implementationSteps.map((step, index) => (
                  <li key={index} className="mb-6 ml-10">
                    <span
                      className="absolute flex items-center justify-center w-6 h-6 bg-white rounded-full left-0 border border-blue-600"
                      style={{ transform: "translateX(-50%)" }}
                    >
                      <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                    </span>
                    <p className="font-normal text-gray-500 dark:text-gray-400">{step}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="font-geist flex items-center justify-between">
                  Download Extension
                  <Monitor className="h-5 w-5 text-[#9ca3af]" />
                </CardTitle>
                <CardDescription>Get started with FilterX browser extension</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" /> Download Now
                </Button>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle className="font-geist flex items-center justify-between">
                  Mobile Version
                  <Smartphone className="h-5 w-5 text-[#9ca3af]" />
                </CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailUpdate}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    onClick={handleEmailUpdate}
                    className="bg-white text-black mt-4 border border-gray-300 shadow-sm hover:bg-gray-100"
                  >
                    {isUpdating ? "Updating..." : "Update Email"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <div className="mt-0">
                  <p className="text-sm text-muted-foreground">
                    <Mail className="inline mr-1 h-4 w-4" />
                    You'll be notified when the mobile version is available.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}