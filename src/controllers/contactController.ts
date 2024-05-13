import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Route,
  Body,
  Path,
  Query,
} from "tsoa";
import APIError from "../errors/apiError";
// import
import ContactService from "../services/contact.service";

interface CreateContactRequest {
  name: string;
  email: string;
  password: string;
}
interface UpdateContactRequest {
  name?: string;
  email?: string;
  password?: string;
}
const contactService = new ContactService();

@Route("/contact")
export class ContactController extends Controller {
  @Post()
  public async createUser(
    @Body() requestBody: CreateContactRequest
  ): Promise<any> {
    try {
      const { name, email, password } = requestBody;
      
      const newContact = await contactService.create({
        name,
        email,
        password,
      });

        console.log("new contact: ", newContact)
      return newContact.Contact;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  public async getContacts(@Query("page") page: number = 1): Promise<any> {
    try {
      const { contact, pagination } = await contactService.getAll(page);
      return { contact, pagination };
    } catch (error) {
      this.setStatus(404);
    }
  }

  @Get(":id")
  public async getContactById(@Path("id") id: string): Promise<any | null> {
    try {
      return await contactService.getById(id);
    } catch (error) {
      if (error instanceof APIError) {
        this.setStatus(404);
        return null;
      }
      throw error;
    }
  }

  @Put(":id")
  public async updateContactById(
    @Path("id") id: string,
    @Body() requestBody: UpdateContactRequest
  ): Promise<any> {
    try {
      const { name, email, password } = requestBody;
      const updateContact = await contactService.updateById(id, {
        name,
        email,
        password,
      });
      return updateContact.Contact;
    } catch (error) {
      throw error;
    }
  }

  @Delete(":id")
  public async deleteContactById(@Path("id") id: string): Promise<any> {
    try {
      return await contactService.deleteById(id);
    } catch (error) {
      throw error;
    }
  }
}
