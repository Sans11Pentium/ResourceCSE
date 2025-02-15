"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getDoc } from '@/lib/actions/delete.action';
import Loader from '@/components/ui/Loader';
import Youtube from '@/components/ui/Youtube';
import Files from '@/components/ui/Files';
import { BookOpen, FileText, PlayCircle, FileQuestion, PresentationIcon } from 'lucide-react';

const Page = ({ params }: { params: Promise<{ year: string, subject: string }> }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [coursecode, setCoursecode] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [contentData, setContentData] = useState<any>(null);
  const [availableContent, setAvailableContent] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { subject } = await params;
      if (subject) {
        const res = await getDoc(subject);
        const plainTextdata = JSON.parse(JSON.stringify(res));
        console.log(plainTextdata);

        setData(plainTextdata);
        setCoursecode(subject);
        setLoading(false);
        
        const contentTypes = [];
        if (plainTextdata.ebooks?.length) contentTypes.push("Ebooks");
        if (plainTextdata.ppts?.length) contentTypes.push("PPTs");
        if (plainTextdata.notes?.length) contentTypes.push("Notes");
        if (plainTextdata.ytPlaylist?.length) contentTypes.push("Youtube Playlists");
        if (plainTextdata.pyqs?.length) contentTypes.push("PYQS");
        setAvailableContent(contentTypes);
      }
    };
    fetchData();
  }, [params]);

  useEffect(() => {
    setContentData(data?.[content.toLowerCase().replace(" ", "")] || null);
  }, [content, data]);

  if (loading) {
    return <Loader />;
  }

  const getIcon = (contentType: string) => {
    switch (contentType) {
      case "Ebooks":
        return <BookOpen className="w-6 h-6" />;
      case "Notes":
        return <FileText className="w-6 h-6" />;
      case "Youtube Playlists":
        return <PlayCircle className="w-6 h-6" />;
      case "PYQS":
        return <FileQuestion className="w-6 h-6" />;
      case "PPTs":
        return <PresentationIcon className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#073b4c] text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#caffbf] mb-4">
            {data?.coursename}
          </h1>
          <p className="text-[#48bfe3] text-2xl font-semibold max-w-2xl mx-auto">
            Course Code: {coursecode}
          </p>
        </div>

        {/* Content Navigation */}
        {availableContent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {availableContent.map((item, index) => (
              <button
                key={index}
                onClick={() => setContent(item)}
                className={`p-6 rounded-xl transition-all duration-300 flex items-center gap-3 w-full 
                  ${content === item 
                    ? 'bg-[#caffbf] text-[#073b4c] shadow-lg scale-105 font-bold' 
                    : 'bg-[#48bfe3] text-white hover:bg-[#caffbf] hover:text-[#073b4c] hover:scale-105 shadow-md font-bold'
                  }`}
              >
                {getIcon(item)}
                <span className="text-lg font-bold">{item}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">No content available for this subject.</p>
          </div>
        )}

        {/* Content Display */}
        <div className="bg-[#caffbf] text-[#073b4c] rounded-2xl shadow-xl p-6">
          {content === "Notes" && <Files contentData={contentData} />}
          {content === "PYQS" && <Files contentData={contentData} />}
          {content === "Ebooks" && <Files contentData={contentData} />}
          {content === "PPTs" && <Files contentData={contentData} />}
          {content === "Youtube Playlists" && <Youtube contentData={contentData} />}
          {content === "" && (
            <div className="flex justify-center items-center flex-col w-full my-5">
              <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl">
                <iframe
                  src="https://drive.google.com/file/d/1eMnGQeeV4dr-1Hzb1hlu1f0bE0tkNx_L/preview?usp=sharing"
                  className="w-full aspect-[4/3] rounded-lg"
                  allow="autoplay"
                  title="PDF Viewer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
