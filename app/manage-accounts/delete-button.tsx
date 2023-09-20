import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/lib/actions";

export function DeleteButton() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button intent="danger" variant="thin">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="isolate">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            asChild
            className="w-auto bg-transparent hover:bg-transparent"
          >
            <form action={deleteUser}>
              <Button className="border border-red-600 bg-transparent text-red-600 hover:bg-transparent">
                Delete
              </Button>
            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
