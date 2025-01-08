'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Copy, History, Star, Trash2, Heart, Share2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ToastAction } from "@/components/ui/toast"
export default function StylishTextGenerator() {
  const [inputText, setInputText] = useState('')
  const [stylizedTexts, setStylizedTexts] = useState([])
  const [favorites, setFavorites] = useState([])
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = async (e) => {
    const text = e.target.value
    setInputText(text)
    setIsLoading(true)

    if (text) {
      try {
        const response = await fetch(`https://api.nexoracle.com/misc/stylish-text?apikey=4aeb57e3ed0f238762&text=${encodeURIComponent(text)}`)
        const data = await response.json()
        setStylizedTexts(data.result)
        
        // Add to history
        const historyItem = {
          text,
          timestamp: new Date().toISOString(),
          results: data.result
        }
        setHistory(prev => [historyItem, ...prev].slice(0, 10))
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate stylized text. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      setStylizedTexts([])
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `"${text}" has been copied to your clipboard.`,
      action: <ToastAction altText="Undo">Undo</ToastAction>,
    })
  }

  const toggleFavorite = (text) => {
    setFavorites(prev => {
      if (prev.includes(text)) {
        return prev.filter(t => t !== text)
      }
      return [...prev, text]
    })
    toast({
      title: favorites.includes(text) ? "Removed from favorites" : "Added to favorites",
      description: text,
    })
  }

  const clearHistory = () => {
    setHistory([])
    toast({
      title: "History cleared",
      description: "Your generation history has been cleared.",
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Stylish Text Generator
        </h1>
        <p className="text-muted-foreground">
          Transform your text into beautiful styles for social media, messaging, and more
        </p>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your text here..."
              value={inputText}
              onChange={handleInputChange}
              className="text-lg"
            />
            {isLoading && (
              <Alert>
                <AlertDescription>
                  Generating stylish variations...
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="generated" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generated">
            Generated Styles
          </TabsTrigger>
          <TabsTrigger value="favorites">
            Favorites
            <Badge variant="secondary" className="ml-2">
              {favorites.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="history">
            History
            <Badge variant="secondary" className="ml-2">
              {history.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generated" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stylizedTexts.map((item, index) => (
              <Card key={index} className="transform transition-all hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-4">
                    <p className="text-xl text-center py-4">{item.result}</p>
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(item.result)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFavorite(item.result)}
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 ${
                            favorites.includes(item.result) ? 'fill-current text-red-500' : ''
                          }`}
                        />
                        {favorites.includes(item.result) ? 'Favorited' : 'Favorite'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((text, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-4">
                    <p className="text-xl text-center py-4">{text}</p>
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(text)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFavorite(text)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Recent Generations</h3>
              <Button variant="outline" size="sm" onClick={clearHistory}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear History
              </Button>
            </div>
            {history.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </CardTitle>
                  <CardDescription>{item.text}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.results.slice(0, 4).map((result, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="truncate">{result.result}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(result.result)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}