'use client';

import { Button } from '@/components/ui/button';
import { random } from 'lodash';
import { useState } from 'react';
import { Post } from '..';
import { CMSForm } from './components/cmsForm';

// import { CMSForm } from '@/components/CMSForm';
// import { DataTable } from '@/components/DataTable';
// import { Button } from '@/components/ui/button';
// import { Post } from '@/types';
// import { useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'First Post',
      content: 'This is the first post content.',
      status: 'published',
      createdAt: new Date().toISOString(),
    },
    // Add more sample data if needed
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);

  const handleAdd = (data: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...data,
      id: random(1000, 9999).toString(),
      createdAt: new Date().toISOString(),
    };
    setPosts([...posts, newPost]);
    setIsFormOpen(false);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleUpdate = (data: Omit<Post, 'id' | 'createdAt'>) => {
    if (!editingPost) return;
    setPosts(
      posts.map((post) =>
        post.id === editingPost.id ? { ...post, ...data } : post,
      ),
    );
    setIsFormOpen(false);
    setEditingPost(undefined);
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">CMS Dashboard</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Post</Button>
      </div>
      {/* <DataTable data={posts} onEdit={handleEdit} onDelete={handleDelete} /> */}
      <CMSForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        defaultValues={editingPost}
        onSubmit={editingPost ? handleUpdate : handleAdd}
      />
    </div>
  );
}
