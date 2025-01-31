import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateUser } from "@/hooks/useCreateUser";

const formSchema = z.object({
  user_name: z.string().min(1, "El nombre de usuario es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  user_type: z.enum(["admin", "bioquimica"] as const),
});

type FormValues = z.infer<typeof formSchema>;

export const NewUserForm = () => {
  const { user } = useAuth();
  const { mutate: createUser, isPending } = useCreateUser();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: "",
      password: "",
      user_type: undefined,
    },
  });

  if (!user || user.user_type !== 'admin') {
    return (
      <div className="text-red-500">
        {!user ? "Debes iniciar sesión para crear usuarios." : "No tienes permisos para crear usuarios. Debes ser administrador."}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => createUser(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="user_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de Usuario</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Usuario</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de usuario" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="bioquimica">Bioquímica</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creando..." : "Crear Usuario"}
        </Button>
      </form>
    </Form>
  );
};