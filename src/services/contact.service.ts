import ContactRepository from "../repository/contactRepository";
import APIError from "../errors/apiError";
import { ContactSchema } from "../schema/contactSchema";
// import { hashPassword } from "../utils/auth";
import { ContactResult } from "./@types/contact-service.type";
import { ContactSchemaType } from "../schema/@types/contact";
import { hashPassword } from "../utils/jwt";

export default class ContactService {
  static create(arg0: { name: string; email: string; password: string; }) {
    throw new Error("Method not implemented.");
  }
  private repo: ContactRepository;

  constructor() {
    this.repo = new ContactRepository();
  }

  async create(ContactType: ContactSchemaType): Promise<ContactResult> {
    try {
      const { name, email, password } = ContactType;
      const hashedPassword = await hashPassword(password);

      const newContact = await this.repo.createContact({
        name,
        email,
        password: hashedPassword,
        
      });
      return {
        Contact: newContact,
      };
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAll(page: number = 1, size: number = 5) {
    try {
      const { contact, pagination } = await this.repo.findAllContacts(page, size);

      return { contact, pagination };
    
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string): Promise<ContactResult | null> {
    try {
      const Contact = await this.repo.findContactById({ id });
      console.log(Contact)
      if (!Contact) {
        return null;
      }
      return { Contact };
    } catch (error) {
      throw error;
    }
  }

  async updateById(
    id: string,
    updates: Partial<ContactSchemaType>
  ): Promise<ContactResult> {
    try {
      const Contact = await this.getById(id);
      if (!Contact) {
        throw new APIError("Contact not found", 404);
      }

      if (updates.password) {
        updates.password = await hashPassword(updates.password);
      }

      const updatedContact = await this.repo.updateContactById({ id });
      return {
        Contact: updatedContact,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id: string): Promise<{message: string}>{
    try{
      await this.repo.deleteContactById({id})
      return {message: "Contact deleted successfully"}
    }catch(error){
      throw error
    }
  }

  

}
