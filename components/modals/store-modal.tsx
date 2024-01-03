"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { error } from "console";

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const storeMOdal = useStoreModal();

  // disabled when submitting form
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Creating Value
    try {
      setLoading(true);

      // throw new Error("x")

      const response = await axios.post("/api/stores", values); //holds the newly create store Id
      // console.log(response.data)
      // toast.success("Store created: " + `${response.data.id}`) //success message
      window.location.assign(`/${response.data.id}`); //immediate redirect
    } catch (error) {
      // console.log(error)
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Store"
      description="Add new store to manage products and categories"
      isOpen={storeMOdal.isOpen}
      onClose={storeMOdal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="E-Commerce"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                disabled={loading}
                variant={"outline"}
                onClick={storeMOdal.onClose}
              >
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
