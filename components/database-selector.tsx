"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Database } from "lucide-react"
import { DATABASE_OPTIONS } from "@/lib/constants"

interface DatabaseSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function DatabaseSelector({ value, onChange, disabled }: DatabaseSelectorProps) {
  const selectedDatabase = DATABASE_OPTIONS.find(db => db.value === value)

  return (
    <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database className="h-5 w-5" />
          Database Selection
        </CardTitle>
        <CardDescription>
          Choose the database system for your backend application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a database system" />
          </SelectTrigger>
          <SelectContent>
            {DATABASE_OPTIONS.map((database) => (
              <SelectItem key={database.value} value={database.value}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{database.icon}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{database.label}</span>
                    <span className="text-xs text-muted-foreground">{database.description}</span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedDatabase && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{selectedDatabase.icon}</span>
              <div>
                <h4 className="font-semibold">{selectedDatabase.label}</h4>
                <p className="text-sm text-muted-foreground">{selectedDatabase.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedDatabase.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}